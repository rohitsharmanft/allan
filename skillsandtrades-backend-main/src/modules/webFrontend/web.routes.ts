import express from "express";
import webController from "./web.controller";
import { validate } from "../../middlewares/validation_res";
import { contactUs } from "../../middlewares/validation";
const router = express.Router();

router.post("/contact-us",validate(contactUs),webController.contactUs);
router.get(
  "/skill-details-with-client-review/:id",
  webController.skillDetalsWithReviewList
);

export default router;
