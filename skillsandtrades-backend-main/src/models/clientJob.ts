import mongoose from "mongoose";

const clientJobsSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },
    skillIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skills",
        required: true,
      },
    ],
    projectTitle: {
      type: String,
      default: null,
    },
    projectDescription: {
      type: String,
      default: null,
    },
    uploadImage: {
      type: String,
      default: null,
    },
    startDate: {
      type: Date,
      default:null
    },
    postedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    type: {
      type: String,
      enum: ["job", "project"],
      required: true,
    },

    
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy:{
      type:String,
      enum:["Admin","Client"]
    },

    deletedAt: {
      type: Date,
      default: null,
    },
    location:{
      type:String,
      default:null
    },
       city:{
      type:String,
      default:null
    },
    closingDate:{
      type:Date,
      default:null
    }
  },
  { timestamps: true }
);

const ClientJob = mongoose.model("ClientJob", clientJobsSchema);
export default ClientJob;






