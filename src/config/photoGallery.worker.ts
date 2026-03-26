// // workers/photoGallery.worker.ts
// import { Worker } from "bullmq";
// import { connection } from "./redis"; 
// import { uploadToS3 } from "../middlewares/s3Client"; 
// import * as Models from "../models/index";

// new Worker(
//   "photo-gallery-upload",
//   async (job) => {
//     const { memberId, profileId, files } = job.data;

//     const uploadResults = [];

//     for (const file of files) {
//       const uploaded = await uploadToS3(file, "member/photo-gallery");
//       uploadResults.push(uploaded);
//     }

//     await Models.Profile.updateOne(
//       { _id: profileId, memberId },
//       {
//         $push: {
//           photoGallery: { $each: uploadResults },
//         },
//       }
//     );

//     return { success: true };
//   },
//   { connection }
// );
