from flask import Flask, request, jsonify
import boto3
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app) 

s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name="us-west-1",
)
BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

@app.route("/api/upload", methods=["POST"])
def upload_pill():
    try:
        name = request.form.get("name")
        file = request.files.get("image")
        if not name or not file:
            return jsonify({"error": "Missing name or image"}), 400

        print(f"Received name: {name}")
        print(f"Received file: {file.filename}")

        # Upload to S3
        filename = secure_filename(file.filename)
        s3.upload_fileobj(
            file,
            BUCKET_NAME,
            filename,
            ExtraArgs={"ContentType": file.content_type}, 
        )
        file_url = f"https://{BUCKET_NAME}.s3.us-west-1.amazonaws.com/{filename}"

        print(f"File uploaded to: {file_url}")
        return jsonify({"message": "Pill uploaded successfully", "image_url": file_url}), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
