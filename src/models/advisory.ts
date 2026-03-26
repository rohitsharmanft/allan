import mongoose from "mongoose";

const advisorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    type: {
      type: String,
      enum: ["Client", "Member"],
    },
    // advisoryType: {
    //   type: mongoose.Types.ObjectId,
    //   ref: "AdvisoryType",
    // },
  },
  { timestamps: true }
);

const Advisory = mongoose.model("Advisory",advisorySchema);
export default Advisory;
