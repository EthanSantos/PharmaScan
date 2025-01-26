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

        if not name or not file:
            return jsonify({"error": "Missing name or image"}), 400

        print(f"Received name: {name}")
        print(f"Received file: {file.filename}")

        # Upload image to S3
        filename = secure_filename(file.filename)
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            filename,
            ExtraArgs={"ContentType": file.content_type},
        )

        # Generate a pre-signed URL for the uploaded file
        file_url = s3.generate_presigned_url(
            "get_object",
            Params={"Bucket": BUCKET_NAME, "Key": filename},
            ExpiresIn=3600,  # URL valid for 1 hour
        )

        print(f"Pre-signed URL generated: {file_url}")

        # Store pill info in Supabase
        payload = {"name": name, "image_url": file_url}
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

if __name__ == "__main__":
    app.run(debug=True)
