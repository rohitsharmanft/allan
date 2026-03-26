import express from "express";
import adminController from "./admin.controller";
import authenticator from "../../middlewares/authenticator";
import { restrict } from "../../middlewares/restrict";
import { scope } from "../../config/app_constant";
import { validate } from "../../middlewares/validation_res";
import {
  advisoryListValidation,
  advisoryValidation,
  categoryValidation,
  createPlanValidation,
  login,
  skillValidation,
} from "../../middlewares/validation";

const router = express.Router();

//////   AUTH SECTION  ///////////////
router.post("/login", validate(login), adminController.login);
router.get("/view-profile", authenticator, adminController.viewProfile);
router.put("/update-profile", authenticator, adminController.updateProfile);
router.post("/forgot-password", adminController.forgetPassword);
router.post("/set-new-password", adminController.setNewPassword);
router.put("/change-password", authenticator, adminController.changePassword);
router.post("/check-reset-token", adminController.checkResetToken);

////////// CATEGORY SECTION /////////
router.post(
  "/create-category",
  authenticator,
  validate(categoryValidation),
  adminController.createCategory
);
router.put("/update-category", authenticator, adminController.updateCategory);
router.get("/get-all-category", adminController.allCategory);
router.delete(
  "/delete-category/:id",
  authenticator,
  adminController.deleteCategory
);

////////// SKILLS SECTION /////////
router.post(
  "/create-skill",
  authenticator,
  validate(skillValidation),
  adminController.createSkill
);
router.delete("/delete-skill/:id", authenticator, adminController.deleteSkill);
router.post("/get-skills-by-category", adminController.getSkillsByCategory);

////////// MEMBER SECTION /////////
router.post("/member-verified-by-admin", adminController.memberVerifiedByAdmin);
// router.get("/get-member-count", adminController.memberCount);
router.post(
  "/get-all-member",
  authenticator,
  adminController.memberListWithProfileCount
);
router.get(
  "/member-details/:id",
  authenticator,
  adminController.memberDetailWithProfile
);

router.post(
  "/rating-list",
  authenticator,
  adminController.memberProfileListWithReview
);
router.post(
  "/profile-change-list",
  authenticator,
  adminController.memberProfileChangeList
);
router.post(
  "/admin-action-in-profile-change",
  authenticator,
  adminController.adminActionInProfileChangeRequest
);

////////// CLIENT SECTION /////////
router.post(
  "/client-approval",
  authenticator,
  adminController.handleClientApproval
);
router.post("/client-list", authenticator, adminController.clientList);
// router.put("/member-profile-approval",authenticator,adminController.handleMemberProfileApproval);


////////// CLIENT- JOB SECTION /////////
router.post(
  "/client-list-with-job-count",
  authenticator,
  adminController.clientListWithJobCount
);
router.post(
  "/admin-action-in-review",
  authenticator,
  adminController.adminActionInReview
);
router.post(
  "/job-list-by-client",
  authenticator,
  adminController.jobListByClientId
);
router.put(
  "/jobs/:jobId/delete",
  authenticator,
  adminController.deleteOneJobByAdmin
);

router.put(
  "/clients/:clientId/jobs/delete",
  authenticator,
  adminController.deleteAllJobsOfClientByAdmin
);

///////  ADVISORY SECTION /////////
router.post(
  "/create-advisory",
  authenticator,
  validate(advisoryValidation),
  adminController.createAdvisory
);
router.put("/edit-advisory", authenticator, adminController.editAdvisory);
router.delete(
  "/delete-advisory/:id",
  authenticator,
  adminController.deleteAdvisory
);
router.post(
  "/advisory-list",
  validate(advisoryListValidation),
  adminController.advisoryList
);

///////  BLOGS SECTION /////////
router.post("/create-blog", authenticator, adminController.createBlogs);
router.put("/update-blog", authenticator, adminController.updateBlogs);
router.delete("/delete-blogs/:id", authenticator, adminController.deleteBlogs);
router.get("/get-all-blogs", adminController.getAllBlogs);

////////// NOTIFICATION SECTION /////////
router.post(
  "/get-contact-us-list",
  authenticator,
  adminController.getContactUsList
);
router.get(
  "/get-notifications",
  authenticator,
  adminController.getNotifications
);
router.put(
  "/mark-notification-read",
  authenticator,
  adminController.markNotificationRead
);

////////// MEMBERSHIP SECTION /////////

// router.post(
//   "/create-plan",
//   authenticator,
//   validate(createPlanValidation),
//   adminController.createPlan
// );
// router.put(
//   "/update-plan",
//   authenticator,
//   // validate(createPlanValidation),
//   adminController.updatePlan
// );

/////////// DASHBOARD SECTION /////////////

router.get("/user-count", authenticator, adminController.userCount);
router.get("/user-by-country", authenticator, adminController.userByCountry);
router.get("/get-dashboard-stats",authenticator, adminController.getDashboardStats);

export default router;
