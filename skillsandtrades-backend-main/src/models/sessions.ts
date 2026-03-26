import mongoose from "mongoose";
const { Schema, Types } = mongoose;

// Define the allowed types for 'type' and 'device_type'
const typeEnum = [null, "USER", "ADMIN", "MEMBER"];
const deviceTypeEnum = [null, "iOS", "Android"];

// Create the Sessions Schema
const SessionsSchema = new Schema({
  type: {
    type: String,
    enum: typeEnum,
    default: null,
  },
  admin_id: {
    type: Types.ObjectId,
    ref: "admins",
    default: null,
  },
  user_id: {
    type: Types.ObjectId,
    ref: "users",
    default: null,
  },
  member_id: {
    type: Types.ObjectId,
    ref: "members",
    default: null,
  },
  access_token: {
    type: String,
    default: null,
  },
  device_type: {
    type: String,
    enum: deviceTypeEnum,
    default: null,
  },
  token_gen_at: {
    type: String,
    default: null,
  },
  expire_time: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the model
const Sessions = mongoose.model("sessions", SessionsSchema);
export default Sessions;
