import mongoose from "mongoose";

const categoryShema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: null,
  },

  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
  },
},{timestamps:true});

const Category = mongoose.model("Category", categoryShema);
export default Category;
