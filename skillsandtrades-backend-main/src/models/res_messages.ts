import mongoose from "mongoose";

const ResMessagesSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["SUCCESS", "ERROR"],
    },
    message_type: {
      type: String,
      default: null,
    },
    status_code: {
      type: Number,
      default: 0,
    },
    msg_in_english: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: false,
    },
    code: {
      type: Number,
      default: 400,
    },
  },
  { timestamps: true }
);

const ResMessages = mongoose.model("res_messages", ResMessagesSchema);
export default ResMessages;
