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
    clientId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
    },
    jobId: {
      type: mongoose.Schema.ObjectId,
      ref: "clientjobs",
    },
    memberId: {
      type: mongoose.Schema.ObjectId,
      ref:"members"
    },
  },
  { timestamps: true }
);
const MemberRating = mongoose.model("MemberRating", ratingSchema);
export default MemberRating;
