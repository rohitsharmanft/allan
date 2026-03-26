import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      // required: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    recurring_amount: {
      type: Number,
    },

    payfast_subscription_id: {
      type: String,
      default: null,
    },

    previousSubscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    type: {
      type: String,
      enum: ["new", "upgrade", "extension"],
      default: "new",
    },

    status: {
      type: String,
      enum: ["pending", "active", "cancelled", "failed", "upgraded", "expired"],
      default: "pending",
    },

    start_date: {
      type: Date,
      default: null,
    },

    end_date: {
      type: Date,
      default: null,
    },

    next_billing_date: {
      type: Date,
    },
  },
  { timestamps: true },
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);
export default Subscription;