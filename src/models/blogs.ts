import mongoose from "mongoose";

const blogsSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      default: null,
    },
    description: {
      type: String,
      required: true,
      default: null,
    },
    image: {
      type: String,
      required: true,
      default: null,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
     ref:"Category"
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogsSchema);
export default Blog;
