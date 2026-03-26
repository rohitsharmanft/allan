import express from "express";
import payfastController from "./payfast.controller";

import authenticator from "../../middlewares/authenticator";
import userController from "../user/user.controller";

const router = express.Router();

router.post(
  "/create-subscription/:id",
  payfastController.createSubscription,
);

router.post("/itn", payfastController.payfastITN);

router.post(
  "/upgrade-subscription",
  authenticator,
  payfastController.upgradeSubscription,
);

router.get("/payment-success", payfastController.paymentSuccess);




export default router;
