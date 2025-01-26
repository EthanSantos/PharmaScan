import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  region: "us-west-1", 
});

export default s3;
