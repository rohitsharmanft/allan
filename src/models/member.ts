import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    membership: {
      type: String,
      default: "Free",
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },
    phoneNumber: {
      type: String,
      default: null,
    },
    // whatsappNumber: {
    //   type: String,
    //   default: null,
    // },
    // telephoneNumber: {
    //   type: String,
    //   default: null,
    // },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    otp: {
      type: String,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: "",
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
    idProof: {
      type: String,
      default: null,
    },
    selfie: {
      type: String,
      default: null,
    },

    adminApproval: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isProfile: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    locality: {
      type: String,
      default: null,
    },
    businessTradingName: {
      type: String,
      default: null,
    },
    countryCode: {
      type: String,
      default: null,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    skillIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "skills",
      },
    ],
    longitude: {
      type: Number,
      default: null,
    },
    latitude: {
      type: Number,
      default: null,
    },

    subscriptionStart: {
      type: Date,
      default: null,
    },
    subscriptionEnd: {
      type: Date,
      default: null,
    },
  },

  { timestamps: true },
);

const Member = mongoose.model("Member", memberSchema);
export default Member;

