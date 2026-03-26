// static async payfastITN(req: any, res: express.Response) {
//   try {
//     const data = { ...req.body };
//     console.log("ITN data >>>", data);

//     const receivedSignature = data.signature;
//     delete data.signature; // IMPORTANT: remove signature before hashing

//     // Generate signature
//     const queryString = Object.keys(data)
//       .sort()
//       .map((key) => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}`)
//       .join("&");

//     const generatedSignature = crypto
//       .createHash("md5")
//       .update(
//         process.env.PAYFAST_PASSPHRASE
//           ? `${queryString}&passphrase=${process.env.PAYFAST_PASSPHRASE}`
//           : queryString
//       )
//       .digest("hex");

//     if (receivedSignature !== generatedSignature) {
//       return res.status(400).send("Invalid signature");
//     }

//     const subscriptionId = req.body.custom_str1;
//     const planId = req.body.custom_str2;
//     const paymentStatus = req.body.payment_status;
//     const transactionId = req.body.pf_payment_id;
//     const amount = Number(req.body.amount_gross);

//     const subscription: any = await Models.Subscription.findById(subscriptionId);
//     if (!subscription) {
//       return res.status(400).send("Subscription not found");
//     }

//     const plan: any = await Models.Plan.findById(planId);
//     if (!plan) {
//       return res.status(400).send("Plan not found");
//     }

//     const member: any = await Models.Member.findById(subscription.memberId);
//     if (!member) {
//       return res.status(400).send("Member not found");
//     }

//     // Security check: amount must match plan price
//     if (amount !== Number(plan.price)) {
//       return res.status(400).send("Amount mismatch");
//     }

//     // SUCCESS
//     if (paymentStatus === "COMPLETE") {
//       await Models.Payment.create({
//         memberId: member._id,
//         subscriptionId: subscription._id,
//         amount,
//         transactionId,
//         paymentStatus: "SUCCESS",
//       });

//       const startDate = subscription.startDate || new Date();
//       const endDate = new Date();
//       endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

//       await Models.Subscription.updateOne(
//         { _id: subscription._id },
//         {
//           status: "ACTIVE",
//           startDate,
//           endDate,
//           nextBillingDate: endDate,
//         }
//       );

//       await Models.Member.updateOne(
//         { _id: member._id },
//         {
//           membership: plan.name,
//           subscriptionStart: startDate,
//           subscriptionEnd: endDate,
//         }
//       );
//     }

//     // FAILED
//     else {
//       await Models.Payment.create({
//         memberId: member._id,
//         subscriptionId: subscription._id,
//         amount,
//         transactionId,
//         paymentStatus: "FAILED",
//       });

//       await Models.Subscription.updateOne(
//         { _id: subscription._id },
//         { status: "FAILED" }
//       );
//     }

//     return res.status(200).send("ITN processed");
//   } catch (error) {
//     console.log("ITN error >>>", error);
//     return res.status(500).send("Server error");
//   }
// }

import express from "express";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";

import crypto from "crypto";
import { handleCustomError } from "../../middlewares/index";
import axios from "axios";
import * as emailServices from "../../middlewares/email_services";
class payfastServices {
  static generatePayfastSignature(data: Record<string, any>): string {
    // remove empty + signature
    const filteredData: Record<string, any> = {};

    Object.keys(data).forEach((key) => {
      if (
        key !== "signature" &&
        data[key] !== undefined &&
        data[key] !== null &&
        data[key] !== ""
      ) {
        filteredData[key] = data[key];
      }
    });

    // sort alphabetically
    const sortedKeys = Object.keys(filteredData).sort();

    // build query string
    const queryString = sortedKeys
      .map(
        (key) =>
          `${key}=${encodeURIComponent(filteredData[key]).replace(/%20/g, "+")}`,
      )
      .join("&");

    console.log("STRING TO HASH:", queryString);

    // generate md5
    return crypto.createHash("md5").update(queryString).digest("hex");
  }
  static createSubscriptionPayload(subscription: any, plan: any) {
    const frequencyMap: any = {
      12: 6, // yearly
    };

    const frequency = frequencyMap[plan.durationInMonths] || 6;
    const billing_date = new Date().toISOString().split("T")[0];

    const payload: any = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      amount: Number(plan.price).toFixed(2),
      item_name: `${plan.name.toUpperCase()} PLAN`,
      subscription_type: "1",
      frequency: String(frequency),
      cycles: "0",
      recurring_amount: Number(plan.price).toFixed(2),
      custom_str1: subscription._id.toString(),
      custom_str2: plan._id.toString(),
      billing_date,
      notify_url: `${process.env.APP_URL}/Member/payment/itn`,
      return_url: `${process.env.FRONTEND_URL}/Member/payment/success`,
      cancel_url: `${process.env.FRONTEND_URL}/Member/payment/cancel`,
    };

    payload.signature = this.generatePayfastSignature(payload);

    return {
      payfastUrl: process.env.PAYFAST_URL,
      payload,
    };
  }

  static generateSignatureITN(data: any) {
    // Step 1: Sort keys alphabetically
    const sortedKeys = Object.keys(data)
      .filter((key) => key !== "signature")
      .sort();

    let pfOutput = "";

    sortedKeys.forEach((key) => {
      if (data[key] !== undefined) {
        pfOutput += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, "+")}&`;
      }
    });

    // Remove last &
    pfOutput = pfOutput.slice(0, -1);

    console.log("FINAL STRING TO HASH:", pfOutput);

    return crypto.createHash("md5").update(pfOutput).digest("hex");
  }

  static async handleITN(req: any) {
    const rawBody = req.rawBody;

    if (!rawBody) {
      return { message: "Invalid request" };
    }

    const receivedSignature = new URLSearchParams(rawBody).get("signature");

    const generatedSignature = crypto
      .createHash("md5")
      .update(rawBody.replace(/&signature=.*$/, ""))
      .digest("hex");

    if (generatedSignature !== receivedSignature) {
      return { message: "Invalid signature" };
    }

    const data = req.body;

    if (data.merchant_id !== process.env.PAYFAST_MERCHANT_ID) {
      return { message: "Merchant mismatch" };
    }

    const subscription: any = await Models.Subscription.findById(
      data.custom_str1,
    );
    if (!subscription) return { message: "OK" };

    const plan: any = await Models.Plan.findById(data.custom_str2);
    if (!plan) return { message: "OK" };

    const member: any = await Models.Member.findById(subscription.memberId);
    if (!member) return { message: "OK" };

    const existingPayment = await Models.Payment.findOne({
      transactionId: data.pf_payment_id,
    });
    if (existingPayment) return { message: "OK" };

    const amount = parseFloat(data.amount_gross).toFixed(2);
    if (amount !== Number(plan.price).toFixed(2)) {
      return { message: "OK" };
    }

    // ================= PAYMENT SUCCESS =================
    if (data.payment_status === "COMPLETE") {
      const payfastToken = data.token || null;

      await Models.Payment.create({
        memberId: member._id,
        subscriptionId: subscription._id,
        planId: plan._id,
        amount,
        transactionId: data.pf_payment_id,
        paymentStatus: "success",
      });

      const startDate = subscription.start_date || new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

      await Models.Subscription.updateOne(
        { _id: subscription._id },
        {
          status: "active",
          start_date: startDate,
          end_date: endDate,
          next_billing_date: endDate,
          payfast_subscription_id: payfastToken,
        },
      );

      await Models.Member.updateOne(
        { _id: member._id },
        {
          membership: plan.name,
          planId: plan?._id,
          subscriptionStart: startDate,
          subscriptionEnd: endDate,
        },
      );

      if (member) {
        const paymentMailData = {
          email: member.email,
          fullName: member.fullName,
          transactionId: data.pf_payment_id,
          paymentDate: new Date().toLocaleString(),
          planName: plan.name,
          amount: amount,
          paymentMethod: "PayFast",
          dashboardLink: `${process.env.FRONTEND_URL}/dashboard`,
          companyName: "Skills$Trades",
          subscriptionStart: startDate,
          subscriptionEnd: endDate,
        };

        await emailServices.paymentSuccessMail(paymentMailData);
      }
    } else {
      // ================= PAYMENT FAILED =================
      await Models.Payment.create({
        memberId: member._id,
        subscriptionId: subscription._id,
        planId: plan._id,
        amount,
        transactionId: data.pf_payment_id,
        paymentStatus: "failed",
      });

      await Models.Subscription.updateOne(
        { _id: subscription._id },
        { status: "failed" },
      );
    }

    return { message: "ITN processed" };
  }

  static async cancelSubscription(token: string) {
    try {
      if (!token) {
        throw await handleCustomError(
          "Subscription token is required",
          "ENGLISH",
        );
      }

      const url = `${process.env.PAYFAST_API_URL}/subscriptions/${token}/cancel`;

      const response = await axios.post(
        url,
        {
          merchant_id: process.env.PAYFAST_MERCHANT_ID,
          merchant_key: process.env.PAYFAST_MERCHANT_KEY,
          version: "v1",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        "Cancel subscription error:",
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
export default payfastServices;
