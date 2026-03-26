
import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});




// middlewares / uploadToS3.ts;



// import { PutObjectCommand } from "@aws-sdk/client-s3";
// import { s3 } from "../config/s3Client";
// import { randomBytes } from "crypto";

// export const uploadToS3 = (folder: string) => {
//   return async (req: any, res: any, next: any) => {
//     try {
//       if (!req.files || Object.keys(req.files).length === 0) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       // Handle single or multiple files
//       const files = Array.isArray(req.files.image)
//         ? req.files.image
//         : [req.files.image];

//       const uploadedFiles: any[] = [];

//       for (const file of files) {
//         const fileBuffer = file.data || file.buffer;
//         const fileName = `${folder}/${Date.now()}-${randomBytes(6).toString(
//           "hex"
//         )}-${file.name}`;

//         const uploadParams = {
//           Bucket: process.env.AWS_S3_BUCKET!,
//           Key: fileName,
//           Body: fileBuffer,
//           ContentType: file.mimetype,
//           ACL: "public-read", // optional, only if you want public URLs
//         };

//         await s3.send(new PutObjectCommand(uploadParams));

//         uploadedFiles.push({
//           key: fileName,
//           url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
//         });
//       }

//       // Add uploaded file info to request object
//       req.uploadedFiles = uploadedFiles;

//       next();
//     } catch (error) {
//       console.error("S3 Upload Error:", error);
//       res.status(500).json({ error: "File upload failed", details: error });
//     }
//   };
// };



// import { uploadToS3 } from "../middlewares/uploadToS3";

// router.post(
//   "/upload-service-image",
//   uploadToS3("admin/service"),
//   async (req, res) => {
//     try {
//       const uploaded = req.uploadedFiles[0];
//       res.json({
//         success: true,
//         message: "File uploaded successfully",
//         fileUrl: uploaded.url,
//       });
//     } catch (err) {
//       res
//         .status(500)
//         .json({ success: false, message: "Upload failed", error: err });
//     }
//   }
// );

