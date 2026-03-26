import express from "express";
import userController from "./user.controller";
import authenticator from "../../middlewares/authenticator";
import {
  sendOtp,
  checkOtp,
  signupClientValidation,
  jobCreationValidation,
  changePasswordValidation,
  login,
} from "../../middlewares/validation";
import { validate } from "../../middlewares/validation_res";
// import { multerForUser } from "../../middlewares/multer";
const router = express.Router();

router.post(
  "/sign-up",
  validate(signupClientValidation),
  userController.signUp,
);
router.post("/send-otp", validate(sendOtp), userController.sendOtp);
router.post("/check-otp", validate(checkOtp), userController.checkOtp);
router.post("/login", validate(login), userController.login);
router.post("/forget-password", userController.forgetPassword);
router.post("/check-security-code", userController.checkSecurityCode);
router.post("/set-new-password", userController.setNewPassword);
router.put(
  "/change-password",
  authenticator,
  validate(changePasswordValidation),
  userController.changePassword,
);

router.get("/view-profile", authenticator, userController.viewProfile);

router.put("/update-profile", authenticator, userController.edit);

router.post("/get-skills-by-category", userController.getSkillsByCategory);

router.get("/get-all-category", userController.allCategory);

router.post(
  "/create-job",
  authenticator,
  validate(jobCreationValidation),
  userController.createJob,
);
router.delete("/delete-job", authenticator, userController.deleteJob);

router.post("/quote-list", userController.memberQuoteList);

router.post(
  "/member-skill-list",
  authenticator,
  userController.memberSkillListing,
);

router.post("/create-rating", authenticator, userController.createRating);

router.post(
  "/client-action-in-quote",
  authenticator,
  userController.clientActionForQuote,
);

// router.get("/rating-list",authenticator, userController.memberRatingList);

router.post("/get-client-jobs", authenticator, userController.getUserJobs);

router.get("/job-details/:id", authenticator, userController.jobDetails);

router.post(
  "/profile-list-with-location",
  userController.memberProfileListForLocation,
);
// router.post("/quote-list-by-job", userController.memQuoteListByJob);

router.get("/skill-list-with-search", userController.skillListWithSearch);

router.get("/client-get-review", authenticator, userController.clientReview);

router.post(
  "/quote-accepted-list",
  authenticator,
  userController.quoteAcceptedListByClient,
);
router.get("/quote-details/:id", authenticator, userController.quoteDetail);
router.get("/make-job-done/:id", authenticator, userController.markJobDone);

router.get(
  "/rating-details-by-quote/:id",
  authenticator,
  userController.ratingDetails,
);

export default router;
