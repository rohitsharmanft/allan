import express from "express";
import memberController from "./member.conroller";
import authenticator from "../../middlewares/authenticator";
import {
  addProfileValidation,
  changePasswordValidation,
  checkOtp,
  login,
  quoteValidation,
  sendOtp,
  signupMemberValidation,
} from "../../middlewares/validation";
import { validate } from "../../middlewares/validation_res";
import { checkSubscription } from "../../middlewares/check_subscription";

const router = express.Router();

router.post(
  "/sign-up",
  validate(signupMemberValidation),
  memberController.signUp,
);

router.post("/send-otp", validate(sendOtp), memberController.sendOtp);
router.post("/check-otp", validate(checkOtp), memberController.checkOtp);

router.post("/check-id", memberController.checkId);

router.post("/login", validate(login), memberController.login);

// router.get("/view-profile", authenticator, memberController.viewProfile);

router.post("/forget-password", memberController.forgetPassword);

router.post("/set-new-password", memberController.setNewPassword);

router.post("/check-reset-token", memberController.checkResetToken);

router.post(
  "/change-password",
  authenticator,
  validate(changePasswordValidation),
  memberController.changePassword,
);

router.put("/update-profile", authenticator, memberController.updateProfile);

router.post(
  "/add-profile",
  authenticator,
  checkSubscription,
  validate(addProfileValidation),
  memberController.createMemberProfile,
);

router.get("/get-all-category", memberController.allCategory);

router.post("/get-skills-by-category", memberController.getSkillsByCategory);

router.post(
  "/create-quote",
  authenticator,
  validate(quoteValidation),
  checkSubscription,
  memberController.createQuote,
);

router.get(
  "/view-profile",
  authenticator,
  checkSubscription,
  memberController.viewPersonalProfile,
);

router.post("/member-list", memberController.memberListWithProfileCount);

router.post("/job-listing", memberController.jobListing);

router.get(
  "/skill-details-with-client-review/:id",
  memberController.skillDetalsWithReviewList,
);

router.put(
  "/member-edit-profile",
  authenticator,
  checkSubscription,
  memberController.memberEditProfile,
);

router.get(
  "/member-profile-list-with-review",
  authenticator,
  memberController.memberProfileListWithReview,
);

router.post(
  "/profile-list-with-location",
  memberController.memberProfileListForLocation,
);
router.post("/advisory-list", memberController.advisoryList);
router.post("/member-jobs", authenticator, memberController.getMemberJobs);
router.get("/get-plan", memberController.getPlan);
router.get(
  "/get-subscription-plan",
  authenticator,
  memberController.memberSubscriptionDuration,
);

export default router;


