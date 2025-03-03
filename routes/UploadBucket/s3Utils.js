const AWS = require("aws-sdk");
require("dotenv").config();

// Configure AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
console.log("bucket",process.env.S3_BUCKET_NAME)
// Function to generate a pre-signed URL
const generatePresignedUrl = async (key) => {
  try {
    const s3 = new AWS.S3();
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Expires: 3600, // URL valid for 1 hour
    };

    return s3.getSignedUrlPromise("getObject", params);
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw new Error("Could not generate pre-signed URL");
  }
};

module.exports = { generatePresignedUrl };
