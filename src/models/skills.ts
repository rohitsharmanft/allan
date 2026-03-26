import mongoose from "mongoose";
const skillsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "skills",
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);
const Skill = mongoose.model("Skill", skillsSchema);

export default Skill;
