import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { config } from "dotenv";
config();
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export const uploadToS3 = async (file: any, folder: string) => {
  if (!file) throw new Error("No file provided");
  try {
    const fileName = `${folder}/${Date.now()}-${file.name}`;
    const params: any = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: file.data,
      ContentType: file.mimetype,
      // ACL: "public-read",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    return fileUrl;
  } catch (err) {
    console.error("S3 Upload Error:", err);
    throw err;
  }
};


export const deleteFromS3 = async (fileUrl: string) => {
  try {
    if (!fileUrl) return;
console.log("kishan",fileUrl)
    const urlParts = fileUrl.split("/");
    // Assumes bucket URL format: https://bucket-name.s3.region.amazonaws.com/folder/file.ext
    const key = urlParts.slice(3).join("/");
console.log("key>>>>>",key)
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`Deleted from S3: ${key}`);
  } catch (err) {
    console.error("S3 Delete Error:", err);
    throw err;
  }
};