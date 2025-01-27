from flask import Flask, request, jsonify, Response
import boto3
import os
import requests
from werkzeug.utils import secure_filename
from flask_cors import CORS
from dotenv import load_dotenv
import cv2
from inference_sdk import InferenceHTTPClient

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})

# AWS S3 Configuration
s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="us-west-1",
)
BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

# Supabase Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
SUPABASE_TABLE = "pills"

supabase_headers = {
    "apikey": SUPABASE_API_KEY,
    "Authorization": f"Bearer {SUPABASE_API_KEY}",
    "Content-Type": "application/json",
}

@app.route("/api/upload", methods=["POST"])
def upload_pill():
    try:
        # Get form data
        name = request.form.get("name")
        file = request.files.get("image")
        description = request.form.get("description")

        if not name or not file or not description:
            return jsonify({"error": "Missing name, image or description"}), 400

        print(f"Received name: {name}")
        print(f"Received file: {file.filename}")
        print(f"Received description: {description}")

        # Upload image to S3 with public-read ACL
        filename = secure_filename(file.filename)
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            filename,
            ExtraArgs={"ContentType": file.content_type},
        )


        # Construct the public URL
        file_url = f"https://{BUCKET_NAME}.s3.us-west-1.amazonaws.com/{filename}"
        print(f"Public URL generated: {file_url}")

        # Store pill info in Supabase
        payload = {"name": name, "image_url": file_url, "description": description}
        supabase_response = requests.post(
            f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}",
            headers=supabase_headers,
            json=payload,
        )

        if supabase_response.status_code != 201:
            print(f"Supabase Error: {supabase_response.json()}")
            return jsonify({"error": "Failed to save pill info to Supabase"}), 500

        return jsonify({"message": "Pill uploaded successfully", "image_url": file_url}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/<name>", methods=["GET"])
def get_pill(name):
    # Prepare the query parameters (filter by 'name')
    params = {
        "name": f"eq.{name}",  # Filter by 'name' column in the Supabase table
    }

    # Send GET request to Supabase
    response = requests.get(f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}", headers=supabase_headers, params=params)

    # Check if the request was successful
    if response.status_code == 200:
        # Parse the JSON response and return it
        return jsonify(response.json())
    else:
        # Handle the error case
        return jsonify({"error": "Failed to fetch data", "details": response.text}), response.status_code

@app.route("/api/pills/<int:pill_id>", methods=["DELETE"])
def delete_pill(pill_id):
    try:
        # Step 1: Fetch pill details from Supabase
        params = {"id": f"eq.{pill_id}"}
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}",
            headers=supabase_headers,
            params=params,
        )

        if response.status_code != 200 or not response.json():
            return jsonify({"error": "Pill not found"}), 404

        pill = response.json()[0]

        # Log the pill details for debugging (optional)
        print(f"Pill to be deleted: {pill}")

        # Step 2: Delete the pill from Supabase
        delete_response = requests.delete(
            f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}?id=eq.{pill_id}",
            headers=supabase_headers,
        )

        if delete_response.status_code != 204:
            print(f"Supabase Error: {delete_response.json()}")
            return jsonify({"error": "Failed to delete pill from Supabase"}), 500

        return jsonify({"message": "Pill deleted successfully"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

pill_count = 0

def count_pills_in_livefeed():
    global pill_count  # Access the global pill count
    # Roboflow API setup
    api_url="https://detect.roboflow.com/"
    api_key="uDVEdueE7qDaS3RvtnVl"
    model_id="kkh7-pill-counting/1"

    client = InferenceHTTPClient(
        api_url=api_url,
        api_key=api_key
    )

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error: Failed to capture image.")
            break

        # Send frame for inference
        result = client.infer(frame, model_id=model_id)
        boxes = result["predictions"]

        # Update global pill count
        pill_count = len(boxes)

        # Draw bounding boxes
        for box in boxes:
            x, y, w, h = box['x'], box['y'], box['width'], box['height']
            label = box['class']
            confidence = box['confidence']

            cv2.rectangle(frame, (int(x - w/2), int(y - h/2)), (int(x + w/2), int(y + h/2)), (0, 255, 0), 2)
            cv2.putText(frame, f'{label}: {confidence:.2f}', (int(x - w/2), int(y - h/2) - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    cap.release()

@app.route('/video_feed')
def video_feed():
    """Stream the video feed"""
    return Response(count_pills_in_livefeed(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/pill_count', methods=['GET'])
def get_pill_count():
    global pill_count
    return jsonify({"pill_count": pill_count})

if __name__ == "__main__":
    app.run(debug=True)
