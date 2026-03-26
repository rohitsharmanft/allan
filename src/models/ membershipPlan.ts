import mongoose from "mongoose";

const membershipPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["Free", "Basic", "Premium"],
      required: true,
      unique: true,
    },
    price: Number,
    durationInMonths: Number,

    features: {
      quotationsPerMonth: {
        type: Number, // 0 = unlimited
      },
      canUseGallery: Boolean,
      canAddSocialLinks: Boolean,
      canAccessTraining: Boolean,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Plan = mongoose.model("Plan", membershipPlanSchema);
export default Plan;
