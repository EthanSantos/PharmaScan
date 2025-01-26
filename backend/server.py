from flask import Flask, request, jsonify
import boto3
import os
import requests
from werkzeug.utils import secure_filename
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

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


if __name__ == "__main__":
    app.run(debug=True)
