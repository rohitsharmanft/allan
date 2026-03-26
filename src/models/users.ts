import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
    phoneNumber: {
      type: String,
      default: "",
    },
    whatsappNumber: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    postCode: {
      type: String,
    },
    companyName: {
      type: String,
    },
    otp: {
      type: String,
      default: null,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpiry: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    // clientType: {
    //   type: String,
    //   enum: ["employer", "hiring-manager", "service-seeker"],
    //   // required: true,
    // },
    isDelete: {
      type: Boolean,
      default: false,
    },
    adminApproval: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

export default Users;


