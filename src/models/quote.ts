import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.ObjectId,
      ref: "Member",
      required: true,
    },
    profileId: {
      type: mongoose.Schema.ObjectId,
      ref: "profiles",
    },
    clientId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
    },
    jobId: {
      type: mongoose.Schema.ObjectId,
      ref: "ClientJob",
      required: true,
    },
    description: {
      type: String,
      default: " ",
    },
    file: {
      type: String,
      default: null,
    },
    clientAction: {
      type: String,
      enum: ["pending", "accepted", "rejected","completed"],
      default: "pending",
    },
    isJobDone: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

const Quote = mongoose.model("Quote", quoteSchema);
export default Quote;
