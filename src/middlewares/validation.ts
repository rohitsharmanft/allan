import { check, body } from "express-validator";
import { Types } from "mongoose";
import { ADVISORY_TYPES, JOB_TYPE } from "../config/constant";

// VALIDATION COMPONENTS
const email: any = check("email")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide email")
  .isEmail()
  .withMessage("Please provide vaild email")
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage("Please provide vaild email");

const fullname: any = check("fullName")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide full name");

const language: any = check("language")
  .default("ENGLISH")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide language");

const otp: any = check("otp")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide otp")
  .bail()
  .isLength({ min: 6, max: 6 })
  .withMessage("Your new password should be exactly 6 characters long");

const content: any = check("content")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide content.");

const password: any = check("password")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide password")
  .isLength({ min: 6 })
  .withMessage("Password should be at least 6 characters long");

const title: any = check("title")
  .trim()
  .not()
  .isEmpty()
  .withMessage("please provide title");

const description: any = check("description")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide description")
  .isLength({ min: 20 })
  .withMessage("Description must be at least 20 characters long");

const category = check("categoryId")
  .not()
  .isEmpty()
  .withMessage("Please provide category")
  .custom((value) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid category id");
    }
    return true;
  });
const advisoryType = check("type")
  .not()
  .isEmpty()
  .withMessage("Type is required")
  .custom((value) => {
    if (!Object.values(ADVISORY_TYPES).includes(value)) {
      throw new Error("Type is invalid");
    }
    return true;
  });

const country = check("country")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Country is required");

const jobId: any = check("jobId")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide jobId")
  .custom((value) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid job id");
    }
    return true;
  });
const clientId = check("clientId")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide client Id ")
  .custom((value) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid job id");
    }
    return true;
  });

const profileId: any = check("profileId")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide profile id")
  .custom((value) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid job id");
    }
    return true;
  });

// const skillIds = check("skillIds")
//   .exists({ checkNull: true })
//   .withMessage("At least one skill is required")
//   .bail()
//   .isArray({ min: 1 })
//   .withMessage("Skill IDs must be a non-empty array")
//   .bail()
//   .custom((values) => {
//     const isValid = values.every((id: string) => Types.ObjectId.isValid(id));

//     if (!isValid) {
//       throw new Error("One or more skill IDs are invalid");
//     }

//     return true;
//   });

const skillIds = check("skillIds")
  .exists({ checkNull: true })
  .withMessage("At least one skill is required")
  .bail()
  .customSanitizer((value) => {
    if (typeof value === "string") {
      return JSON.parse(value);
    }
    return value;
  })
  .isArray({ min: 1 })
  .withMessage("Skill IDs must be a non-empty array")
  .bail()
  .custom((values) => {
    const isValid = values.every((id: string) => Types.ObjectId.isValid(id));
    if (!isValid) {
      throw new Error("One or more skill IDs are invalid");
    }
    return true;
  });

const jobType = check("type")
  .not()
  .isEmpty()
  .withMessage("Type is required")
  .custom((value) => {
    if (!Object.values(JOB_TYPE).includes(value)) {
      throw new Error("Type is invalid");
    }
    return true;
  });

const projectTitle = check("projectTitle")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide Title");
const projectDescription = check("projectDescription")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide description");
const location = check("location")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide location");
const city = check("city")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide city");
// const startDate = check("startDate")
//   .not()
//   .isEmpty()
//   .withMessage("Please provide start date")
//   .bail()
//   .isISO8601()
//   .withMessage("Invalid start date format")
//   .custom((value) => {
//     const today = new Date();
//     const inputDate = new Date(value);

//     if (inputDate < today.setHours(0, 0, 0, 0)) {
//       throw new Error("Start date cannot be in the past");
//     }
//     return true;
//   });
const closingDate = check("closingDate")
  .not()
  .isEmpty()
  .withMessage("Please provide closing date")
  .bail()
  .isISO8601()
  .withMessage("Invalid closing date format")
  .custom((value, { req }) => {
    const start = new Date(req.body.startDate);
    const end = new Date(value);

    if (end <= start) {
      throw new Error("Closing date must be after start date");
    }

    return true;
  });
const idProof = check("idProof")
  .not()
  .isEmpty()
  .withMessage("ID proof is required")
  .isURL()
  .withMessage("Invalid ID proof URL");

const selfie = check("selfie")
  .not()
  .isEmpty()
  .withMessage("Selfie is required")
  .isURL()
  .withMessage("Invalid selfie URL");

const memberId = check("id")
  .not()
  .isEmpty()
  .withMessage("Member ID required")
  .bail()
  .custom((value) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid member ID");
    }
    return true;
  });
const workDescription = check("workDescription")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Work description cannot be empty")
  .isLength({ min: 20 })
  .withMessage("Work description must be at least 20 characters long");

const overview = check("overview")
  // .optional()
  .trim()
  .not()
  .isEmpty()
  .withMessage("Overview cannot be empty")
  .isLength({ min: 20 })
  .withMessage("Overview must be at least 20 characters long");

// WORK LOCATION
const workLocation = check("workLocation")
  // .optional()
  .trim()
  .not()
  .isEmpty()
  .withMessage("Work location cannot be empty");

// EXPERIENCE (years)
const experience = check("experience")
  // .optional()
  .not()
  .isEmpty()
  .withMessage("Experience cannot be empty")
  .isInt({ min: 0 })
  .withMessage("Experience must be a valid number greater than or equal to 0");

// LATITUDE
const latitude = check("latitude")
  // .optional()
  .not()
  .isEmpty()
  .withMessage("Latitude cannot be empty")
  .isFloat({ min: -90, max: 90 })
  .withMessage("Latitude must be between -90 and 90");

// LONGITUDE
const longitude = check("longitude")
  // .optional()
  .not()
  .isEmpty()
  .withMessage("Longitude cannot be empty")
  .isFloat({ min: -180, max: 180 })
  .withMessage("Longitude must be between -180 and 180");

const oldPassword: any = check("old_password")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please enter old password.");
const newPassword: any = check("new_password")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please enter new password.")
  .isLength({ min: 6 })
  .withMessage("Password should be at least 6 characters long");

const rating = check("rating")
  .not()
  .isEmpty()
  .withMessage("Rating is required")
  .bail()
  .isInt({ min: 1, max: 5 })
  .withMessage("Rating must be an integer between 1 and 5");

const member = check("memberId")
  .not()
  .isEmpty()
  .withMessage("Member ID is required")
  .bail()
  .custom((value) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid member ID");
    }
    return true;
  });

const memberProfileId = check("memberProfileId")
  .not()
  .isEmpty()
  .withMessage("Member profile ID is required")
  .bail()
  .custom((value) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid member profile ID");
    }
    return true;
  });
const review = check("review")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Review cannot be empty")
  .isLength({ min: 5 })
  .withMessage("Review must be at least 5 characters long");

const quoteId = check("quoteId")
  .not()
  .isEmpty()
  .withMessage("Quote ID is required")
  .bail()
  .custom((value) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new Error("Invalid quote ID");
    }
    return true;
  });
const planName = check("name")
  .trim()
  .not()
  .isEmpty()
  .withMessage("Please provide plan name")
  .isLength({ min: 2 })
  .withMessage("Plan name must be at least 2 characters long");
const planPrice = check("price")
  .not()
  .isEmpty()
  .withMessage("Please provide price")
  .bail()
  .isFloat({ min: 0 })
  .withMessage("Price must be a valid number greater than or equal to 0");

const durationInMonths = check("durationInMonths")
  .not()
  .isEmpty()
  .withMessage("Please provide duration")
  .bail()
  .isInt({ min: 1 })
  .withMessage("Duration must be at least 1 month");

// EXPORT VALIDATION
export const signupMemberValidation = [
  email,
  fullname,
  password,
  country,
  category,
  skillIds,
  language,
];
export const signupClientValidation = [
  email,
  fullname,
  password,
  country,
  language,
];
export const login = [email, password];
export const sendOtp = [email, language];
export const checkOtp = [email, otp, language];
export const edit = [fullname, language];
export const contentGenerate = [content];
export const advisoryValidation = [title, description, category, advisoryType];
export const categoryValidation = [title];
export const quoteValidation = [jobId, clientId, profileId, description];
export const jobCreationValidation = [
  category,
  // skillIds,
  jobType,
  projectTitle,
  projectDescription,
  location,
  city,

  // startDate
];
export const advisoryListValidation = [advisoryType];
export const idVerificationValidation = [idProof, selfie, memberId];
export const addProfileValidation = [
  workDescription,
  overview,
  workLocation,
  latitude,
  longitude,
];
export const skillValidation = [title, category];
export const contactUs = [fullname, email];
export const changePasswordValidation = [oldPassword, newPassword];
export const ratingValidation = [
  rating,
  review,
  member,
  memberProfileId,
  jobId,
  quoteId,
];
export const createPlanValidation = [planName, planPrice, durationInMonths];
