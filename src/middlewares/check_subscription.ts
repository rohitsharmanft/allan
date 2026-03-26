
import express from "express"

import * as Models from "../models/index";


export const checkSubscription = async (req:any, res:express.Response, next:express.NextFunction) => {
  try {
    const memberId = req.user_data?._id;
    // console.log("memberId", memberId);
    // console.log("middleware ", req.user_data);
    const now = new Date();

    const member = await Models.Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // console.log("now:", now);
    const activeSubscription = await Models.Subscription.findOne({
      memberId: member._id,
      status: "active",
      end_date: { $gt: now },
    }).populate("planId");

    // console.log("activeSubscription", activeSubscription);

    if (!activeSubscription) {
      if (member.membership !== "Free") {
        member.membership = "Free";
        member.planId = null;
        await member.save();
      }
      return next();
    }

    // const plan:any = activeSubscription.planId;

    // if (plan && member.membership !== plan.type) {
    //   member.membership = plan.type; // "Basic" or "Premium"
    //   member.planId = plan._id;
    //   await member.save();
    // }

    next();
  } catch (error) {
    console.error("Subscription middleware error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
