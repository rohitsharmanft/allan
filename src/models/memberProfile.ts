import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    skillIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skills",
      },
    ],
    workDescription: {
      type: String,
      default: "",
    },
    businessTradingName: {
      type: String,
      default: null,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    overview: {
      type: String,
      default: null,
    },
    town: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
      default: null,
    },
    workLocation: {
      type: String,
      default: null,
    },
    // experience: {
    //   type: Number,
    //   default: null,
    // },
    socialLinks: {
      type: {
        facebook: { type: String, default: null },
        instagram: { type: String, default: null },
        linkedin: { type: String, default: null },
        tiktok: { type: String, default: null },
        twitter: { type: String, default: null },
        website: { type: String, default: null },
      },
      default: {},
    },

    // qualification: {
    //   type: String,
    //   default: null,
    // },
    // affiliation: {
    //   type: String,
    //   default: null,
    // },
    memberId: {
      type: mongoose.Schema.ObjectId,
      ref: "Member",
      required: true,
    },
    // hourlyCharged: {
    //   type: Number,
    //   default: null,
    // },
    photoGallery: {
      type: [String],
      default: [],
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    longitude: {
      type: Number,
      default: null,
    },
    latitude: {
      type: Number,
      default: null,
    },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] },
    },
  },
  { timestamps: true }
);
profileSchema.index({ location: "2dsphere" });
const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
