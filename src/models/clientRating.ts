import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      default: 0,
    },
    review: {
      type: String,
      default: "",
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    memberProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientJob",
    },
    quoteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quote",
    },
    status: {
      type: String,
      enum: ["published,unpublished"],
      default: "published",
    },
  },
  { timestamps: true }
);
const ClientRating = mongoose.model("ClientRating", ratingSchema);
export default ClientRating;
