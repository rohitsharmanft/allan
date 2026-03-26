// import crypto from "crypto";

// export const payfastITN = async (req, res) => {
//   try {
//     const data = req.body;

//     // 1️⃣ Verify signature
//     const signature = data.signature;
//     delete data.signature;

//     const queryString = Object.keys(data)
//       .sort()
//       .map((k) => `${k}=${encodeURIComponent(data[k])}`)
//       .join("&");

//     const generatedSignature = crypto
//       .createHash("md5")
//       .update(queryString + `&passphrase=${process.env.PAYFAST_PASSPHRASE}`)
//       .digest("hex");

//     if (signature !== generatedSignature) {
//       return res.status(400).send("Invalid signature");
//     }

//     // 2️⃣ Extract data
//     const subscriptionId = data.custom_str1;
//     const paymentStatus = data.payment_status; // COMPLETE / FAILED
//     const transactionId = data.pf_payment_id;
//     const amount = Number(data.amount_gross);

//     const subscription = await Subscription.findById(subscriptionId);
//     if (!subscription) {
//       return res.status(400).send("Subscription not found");
//     }

//     const member = await Member.findById(subscription.memberId);
//     if (!member) {
//       return res.status(400).send("Member not found");
//     }

//     // 3️⃣ SUCCESS PAYMENT
//     if (paymentStatus === "COMPLETE") {
//       await Payment.create({
//         memberId: member._id,
//         subscriptionId: subscription._id,
//         amount,
//         transactionId,
//         paymentStatus: "success",
//       });

//       const start = new Date();
//       const end = new Date();
//       end.setFullYear(end.getFullYear() + 1);

//       await Subscription.updateOne(
//         { _id: subscription._id },
//         {
//           status: "active",
//           start_date: start,
//           next_billing_date: end,
//         }
//       );

//       await Member.updateOne(
//         { _id: member._id },
//         {
//           membership: subscription.plan,
//           subscriptionStart: start,
//           subscriptionEnd: end,
//         }
//       );
//     }

//     // 4️⃣ FAILED PAYMENT
//     else {
//       await Payment.create({
//         memberId: member._id,
//         subscriptionId: subscription._id,
//         amount,
//         transactionId,
//         paymentStatus: "failed",
//       });

//       await Subscription.updateOne(
//         { _id: subscription._id },
//         { status: "failed" }
//       );
//     }

//     res.status(200).send("OK");
//   } catch (err) {import crypto from "crypto";

// export const payfastITN = async (req, res) => {
//   try {
//     const data = req.body;

//     // 1️⃣ Verify signature
//     const signature = data.signature;
//     delete data.signature;

//     const queryString = Object.keys(data)
//       .sort()
//       .map((k) => `${k}=${encodeURIComponent(data[k])}`)
//       .join("&");

//     const generatedSignature = crypto
//       .createHash("md5")
//       .update(queryString + `&passphrase=${process.env.PAYFAST_PASSPHRASE}`)
//       .digest("hex");

//     if (signature !== generatedSignature) {
//       return res.status(400).send("Invalid signature");
//     }

//     // 2️⃣ Extract data
//     const subscriptionId = data.custom_str1;
//     const paymentStatus = data.payment_status; // COMPLETE / FAILED
//     const transactionId = data.pf_payment_id;
//     const amount = Number(data.amount_gross);

//     const subscription = await Subscription.findById(subscriptionId);
//     if (!subscription) {
//       return res.status(400).send("Subscription not found");
//     }

//     const member = await Member.findById(subscription.memberId);
//     if (!member) {
//       return res.status(400).send("Member not found");
//     }

//     // 3️⃣ SUCCESS PAYMENT
//     if (paymentStatus === "COMPLETE") {
//       await Payment.create({
//         memberId: member._id,
//         subscriptionId: subscription._id,
//         amount,
//         transactionId,
//         paymentStatus: "success",
//       });

//       const start = new Date();
//       const end = new Date();
//       end.setFullYear(end.getFullYear() + 1);

//       await Subscription.updateOne(
//         { _id: subscription._id },
//         {
//           status: "active",
//           start_date: start,
//           next_billing_date: end,
//         }
//       );

//       await Member.updateOne(
//         { _id: member._id },
//         {
//           membership: subscription.plan,
//           subscriptionStart: start,
//           subscriptionEnd: end,
//         }
//       );
//     }

//     // 4️⃣ FAILED PAYMENT
//     else {
//       await Payment.create({
//         memberId: member._id,
//         subscriptionId: subscription._id,
//         amount,
//         transactionId,
//         paymentStatus: "failed",
//       });

//       await Subscription.updateOne(
//         { _id: subscription._id },
//         { status: "failed" }
//       );
//     }

//     res.status(200).send("OK");
//   } catch (err) {
//     res.status(500).send("ITN error");
//   }
// };

//     res.status(500).send("ITN error");
//   }
// };

import express from "express";
import crypto from "crypto";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";
import {
  handleCatch,
  handleCustomError,
  sendResponse,
  helpers,
} from "../../middlewares/index";
import payfastServices from "./payfast.services";
import * as emailServices from "../../middlewares/email_services";

class payfastController {

  static async createSubscription(req: any, res: express.Response) {
    try {
      const { id: memberId } = req.params;
      const { planId } = req.body;

      if (!planId) {
        throw await handleCustomError("Plan Id is required", "ENGLISH");
      }

      const plan: any = await Models.Plan.findById(planId).lean();
      if (!plan) {
        throw await handleCustomError("Plan not found", "ENGLISH");
      }

      const existing = await Models.Subscription.findOne({
        memberId,
        status: "active",
        end_date: { $gte: new Date() },
      });

      if (existing) {
        throw await handleCustomError(
          "You already have an active subscription",
          "ENGLISH",
        );
      }

      // // Free plan
      // if (Number(plan.price) <= 0) {
      //   const startDate = new Date();
      //   const endDate = new Date();
      //   endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

      //   const subscription = await Models.Subscription.create({
      //     memberId,
      //     planId: plan._id,
      //     status: "active",
      //     amount: plan.price,
      //     start_date: startDate,
      //     end_date: endDate,
      //   });

      //   return sendResponse(res, subscription, "Free plan activated");
      // }

      const subscription = await Models.Subscription.create({
        memberId,
        planId: plan._id,
        status: "pending",
        amount: plan.price,
      });

      const payfastData = payfastServices.createSubscriptionPayload(
        subscription,
        plan,
      );

      return sendResponse(
        res,
        payfastData,
        "Subscription initiated successfully",
      );
    } catch (error) {
      handleCatch(res, error);
    }
  }


  static async payfastITN(req: any, res: any) {
    try {
      const result = await payfastServices.handleITN(req);

      return res.status(200).send(result.message);
    } catch (error: any) {
      console.log("ITN error >>>", error.message);
      return res.status(200).send("Server error");
    }
  }

  static async upgradeSubscription(req: any, res: express.Response) {
    try {
      const memberId = req.user_data?._id;
      const { planId } = req.body;

      if (!planId) {
        throw await handleCustomError("Plan Id is required", "ENGLISH");
      }

      const activeSub: any = await Models.Subscription.findOne({
        memberId,
        status: "active",
        end_date: { $gte: new Date() },
      });

      // if (!activeSub) {
      //   throw await handleCustomError(
      //     "No active subscription found",
      //     "ENGLISH",
      //   );
      // }

      const newPlan: any = await Models.Plan.findById(planId);
      if (!newPlan) {
        throw await handleCustomError("Plan not found", "ENGLISH");
      }
      ///add neew
      if (!activeSub) {
        const newSubscription = await Models.Subscription.create({
          memberId,
          planId: newPlan._id,
          status: "pending",
          amount: newPlan.price,
        });

        const payfastData = payfastServices.createSubscriptionPayload(
          newSubscription,
          newPlan,
        );

        return sendResponse(res, payfastData, "Subscription initiated");
      }

      ////////

      const currentPlan: any = await Models.Plan.findById(activeSub.planId);
      if (!currentPlan) {
        throw await handleCustomError("Current plan not found", "ENGLISH");
      }
      if (Number(newPlan.price) <= Number(currentPlan.price)) {
        throw await handleCustomError(
          "Upgrade plan must be higher than current plan",
          "ENGLISH",
        );
      }

      if (activeSub.subscription_token) {
        await payfastServices.cancelSubscription(activeSub.subscription_token);
      }

      await Models.Subscription.updateOne(
        { _id: activeSub._id },
        { status: "upgraded" },
      );

      const newSubscription = await Models.Subscription.create({
        memberId,
        planId: newPlan._id,
        status: "pending",
        amount: newPlan.price,
        previousSubscriptionId: activeSub._id,
      });

      const payfastData = payfastServices.createSubscriptionPayload(
        newSubscription,
        newPlan,
      );

      return sendResponse(res, payfastData, "Upgrade initiated");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async paymentSuccess(req: any, res: express.Response) {
    try {
      return res.send(`
        <html>
          <head><title>Payment Success</title></head>
          <body>
            <h1>Payment Successful!</h1>
            <p>Thank you for subscribing. Your subscription is now active.</p>
            <a href="/dashboard">Go to Dashboard</a>
          </body>
        </html>
      `);
    } catch (error: any) {
      return res.status(500).send("Something went wrong.");
    }
  }
}

export default payfastController;
