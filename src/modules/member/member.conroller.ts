import express, { query } from "express";
import crypto from "crypto";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";
import {
  handleCatch,
  handleCustomError,
  sendResponse,
  helpers,
} from "../../middlewares/index";
import { sendOTP } from "../../middlewares/email_services";
import * as emailServices from "../../middlewares/email_services";
import memberServices from "./member.servics";
import { Types } from "mongoose";
import { uploadToS3 } from "../../middlewares/s3Client";
import moment from "moment";
import {
  handleAdvisoryList,
  handleJobList,
  handleMemberDetails,
  handleMemberListWithProfileCount,
  handleProfileListWithLocation,
  handleProfileListWithReview,
  profileWithReview,
} from "./member.aggration";
import MEMBER_MESSAGES from "../../config/message/member_message";
// import { photoGalleryQueue } from "../../config/photoGallery.queues";
const mes = { ...MEMBER_MESSAGES };

// let today: any = moment().utc();

class memberController {
  static async signUp(req: any, res: any) {
    let file: string = null;
    if (req.files && req.files?.image) {
      file = await uploadToS3(req.files?.image, "member/profile");
    }
    try {
      let createMember = await memberServices.createMember(req.body, file);
      await sendOTP(createMember);

      await Models.Notifications.create({
        type: "member_registration",
        title: "New Member Registered",
        message: `A new member, ${createMember.fullName}, has joined the platform.`,
        data: { memberId: createMember._id },
      });

      sendResponse(
        res,
        createMember,
        "Your account is successfully created. Please check your email and verify your OTP.",
      );
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async sendOtp(req: any, res: express.Response) {
    try {
      let { email, language = mes.lang } = req.body;
      let query = { email: email.toLowerCase() };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Member,
        query,
        projection,
        options,
      );
      if (!fetch_data.length) {
        throw await handleCustomError(mes.emailNotRegis, language);
      }
      let number = Math.floor(100000 + Math.random() * 900000);

      if (fetch_data.length) {
        let { _id } = fetch_data[0];
        let query = { _id: _id };
        let update = { otp: number };
        let options = { new: true };
        const updatedata = await DAO.findAndUpdate(
          Models.Member,
          query,
          update,
          options,
        );
        await sendOTP(updatedata);
        sendResponse(res, null, mes.otpSent);
      } else {
        throw await handleCustomError(mes.emailNotRegis, language);
      }
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async checkOtp(req: any, res: express.Response) {
    try {
      let { email, otp, language = mes.lang } = req.body;

      let query = { email: email.toLowerCase() };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Member,
        query,
        projection,
        options,
      );

      if (fetch_data.length) {
        const { _id } = fetch_data[0];

        if (fetch_data[0].otp !== otp) {
          throw await handleCustomError(mes.invalidOtp, language);
        }

        if (fetch_data[0].otp === otp) {
          const update = await DAO.findAndUpdate(
            Models.Member,
            { _id: _id },
            { otpVerified: true, otp: null },
            options,
          );
        }

        sendResponse(res, null, mes.otpVerified);
      } else {
        throw await handleCustomError(mes.emailNotRegis, language);
      }
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async checkId(req: any, res: express.Response) {
    const { id: memberId, language = mes.lang } = req.body;
    try {
      if (!memberId) {
        throw await handleCustomError(mes.memberReq, language);
      }
      const query = { _id: memberId };
      const options = { lean: true };
      const fetch_data = await DAO.getSingleData(
        Models.Member,
        query,
        { __v: 0 },
        options,
      );
      if (!req.files || !req.files?.idProof || !req.files?.selfie) {
        throw await handleCustomError(mes.idSelfieReq, language);
      }
      let idProofFile: any;
      let selfiFile: any;
      if (req.files) {
        idProofFile = await uploadToS3(
          req.files?.idProof,
          "member/doc_verification",
        );
        selfiFile = await uploadToS3(
          req.files?.selfie,
          "member/doc_verification",
        );
      }
      const update: any = {};
      if (req.files) {
        update.idProof = idProofFile;
        update.selfie = selfiFile;
      }

      const update_data: any = await DAO.findAndUpdate(
        Models.Member,
        query,
        update,
        { new: true },
      );
      sendResponse(res, update_data, "successfully updated");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async login(req: any, res: express.Response) {
    try {
      let { email, password: input_password, language = mes.lang } = req.body;
      let response: any;

      let query = { email: email.toLowerCase() };
      let projection = { __v: 0 };
      let options = { lean: true };
      let member: any = await DAO.getSingleData(
        Models.Member,
        query,
        projection,
        options,
      );
      if (!member) {
        throw await handleCustomError(mes.email_not_found, language);
      }

      let { _id, password } = member;

      let decryt = await helpers.decrypt_password(input_password, password);

      if (decryt !== true) {
        throw await handleCustomError(mes.incorrect_password, language);
      }

      if (!member.otpVerified) {
        throw await handleCustomError(mes.otp_not_verified, language);
      }
      if (member.adminApproval === mes.pending) {
        throw await handleCustomError(mes.approvalPending, language);
      }
      if (member.adminApproval === mes.rejected) {
        throw await handleCustomError(mes.approvalReject, language);
      }
      let generate_token = await memberServices.generateMemberToken(_id);
      response = await memberServices.makeMemberResponse(
        generate_token,
        language,
      );
      let message = "Login Successfully";

      let resp = {
        user_details: {
          _id: response._id,
          email: response.email,
          phoneNumber: response.phoneNumber,
          fullName: response.fullName,
          access_token: response.access_token,
          plan: response.planId || null,
        },
        message: message,
      };
      sendResponse(res, resp, message);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async viewProfile(req: any, res: express.Response) {
    try {
      let { _id: user_id } = req.user_data;
      let query = { _id: user_id };
      let projection = {
        __v: 0,
        password: 0,
        otp: 0,
        resetToken: 0,
        resetTokenExpiry: 0,
        isDelete: 0,
      };
      let options = { lean: true };
      let response: any = await DAO.getData(
        Models.Member,
        query,
        projection,
        options,
      );

      sendResponse(res, response, "Success");
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async forgetPassword(req: any, res: express.Response) {
    try {
      let { email, language = mes.lang } = req.body;
      if (!email) {
        throw await handleCustomError(mes.emailReq, language);
      }
      let query = { email: email.toLowerCase() };
      let fetch_data: any = await memberServices.verifyMember(query);

      if (fetch_data.length === 0) {
        throw await handleCustomError(mes.emailNotRegis, language);
      }
      if (fetch_data.length) {
        let { _id } = fetch_data[0];

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 mins

        let update = {
          resetToken,
          resetTokenExpiry,
        };

        await DAO.findAndUpdate(Models.Member, { _id }, update, { new: true });

        await emailServices.memberForgetPasswordMail({
          ...fetch_data[0],
          resetToken,
        });
      }

      sendResponse(res, null, mes.resetLink);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async checkResetToken(req: any, res: express.Response) {
    try {
      let { resetToken, language = mes.lang } = req.body;
      if (!resetToken) {
        throw await handleCustomError(mes.resetTokenReq, language);
      }
      let query = { resetToken: resetToken };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Member,
        query,
        projection,
        options,
      );
      if (fetch_data.length == 0) {
        throw await handleCustomError(mes.resetTokenExp, language);
      }
      sendResponse(res, null, mes.tokenWorking);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async updateProfile(req: any, res: express.Response) {
    try {
      let { _id } = req.user_data;

      let file: string = null;
      if (req.files && req.files?.image) {
        file = await uploadToS3(req.files?.image, "member/profile");
      }
      let createUser = await memberServices.editMember(
        _id,
        req.body,
        file || null,
      );

      sendResponse(res, null, "Profile updated successfully.");
    } catch (err: any) {
      console.log("err", err.message);
      handleCatch(res, err);
    }
  }

  static async changePassword(req: any, res: express.Response) {
    try {
      const { old_password, new_password, language = mes.lang } = req.body;
      const user_id = req.user_data?._id;

      await memberServices.changePassword(
        user_id,
        old_password,
        new_password,
        language,
      );
      sendResponse(res, null, mes.passChangeSuccessully);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async setNewPassword(req: any, res: express.Response) {
    try {
      let { password, resetToken, language = mes.lang } = req.body;
      if (!password) {
        throw await handleCustomError(mes.passReq, language);
      }
      if (!resetToken) {
        throw await handleCustomError(mes.resetTokenReq, language);
      }
      let query = { resetToken };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Member,
        query,
        projection,
        options,
      );

      if (!fetch_data.length) {
        throw await handleCustomError(mes.invalidResetToken, language);
      }

      let member = fetch_data[0];

      if (!member.resetTokenExpiry || member.resetTokenExpiry < Date.now()) {
        throw await handleCustomError(mes.resetTokenExp, language);
      }

      let hashedPassword = await helpers.bcrypt_password(password);

      let update = {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      };

      await DAO.findAndUpdate(Models.Member, { _id: member._id }, update, {
        new: true,
      });

      let message = "New Password Set Successfully";
      sendResponse(res, null, message);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  // static async createMemberProfile(req: any, res: express.Response) {
  //   try {
  //     const member = req.user_data;
  //     const { _id: memberId, planId } = member;

  //     const {
  //       workDescription,
  //       overview,
  //       workLocation,
  //       country,
  //       socialLinks,
  //       longitude = 0,
  //       latitude = 0,
  //       language = mes.lang,
  //     } = req.body;

  //     if (!member) throw await handleCustomError(mes.mNotFound, language);

  //     if (member.adminApproval !== mes.accepted) {
  //       throw await handleCustomError(mes.adminApprovalReq, language);
  //     }
  //     if (!member.isProfile) {
  //       const activeSubscription = await Models.Subscription.findOne({
  //         memberId,
  //         status: "active",
  //         start_date: { $lte: new Date() },
  //         end_date: { $gte: new Date() },
  //       });

  //       if (!activeSubscription) {
  //         throw await handleCustomError(mes.subscriptionReq, language);
  //       }

  //       const plan = await Models.Plan.findById(planId);
  //       if (!plan) {
  //         throw await handleCustomError(mes.planNotFound, language);
  //       }
  //       const location = {
  //         type: "Point",
  //         coordinates: [Number(longitude), Number(latitude)],
  //       };
  //       let finalSocialLinks = [];
  //       let photoGallery: any = [];
  //       if (plan.features.canAddSocialLinks) {
  //         finalSocialLinks = await memberServices.addSocialLink(
  //           member,
  //           socialLinks,
  //           language,
  //         );
  //       } else if (
  //         !plan.features.canAddSocialLinks &&
  //         socialLinks?.length > 0
  //       ) {
  //         throw await handleCustomError(mes.notAllowLink, language);
  //       }

  //       if (plan?.features?.canUseGallery && req.files?.photoGallery) {
  //         const files = Array.isArray(req.files?.photoGallery)
  //           ? req.files.photoGallery
  //           : [req.files.photoGallery];

  //         const uploadPromises = files.map((file) =>
  //           uploadToS3(file, "member/photo-gallery"),
  //         );
  //         photoGallery = await Promise.all(uploadPromises);
  //       } else if (!plan.features.canUseGallery && req.files?.photoGallery) {
  //         throw await handleCustomError(mes.notAllowPhoto, language);
  //       }

  //       const profileData = {
  //         memberId,
  //         skillIds: member?.skillIds,
  //         workDescription,
  //         businessTradingName: member?.businessTradingName,
  //         categoryId: member?.categoryId,
  //         overview,
  //         workLocation,
  //         photoGallery,
  //         country,
  //         longitude,
  //         latitude,
  //         location,
  //         socialLinks: finalSocialLinks,
  //       };

  //       const newProfile = await memberServices.createProfile(
  //         member,
  //         profileData,
  //       );

  //       sendResponse(res, newProfile, mes.profileCreated);
  //     } else {
  //       throw await handleCustomError(mes.profileAlreadyCreated, language);
  //     }
  //   } catch (error) {
  //     handleCatch(res, error);
  //   }
  // }
  static async createMemberProfile(req: any, res: express.Response) {
    try {
      const member = req.user_data;
      const { _id: memberId } = member;

      const {
        workDescription,
        overview,
        workLocation,
        country,
        socialLinks,
        longitude,
        latitude,
        language = mes.lang,
      } = req.body;

      if (!member) throw await handleCustomError(mes.mNotFound, language);

      if (member.adminApproval !== mes.accepted) {
        throw await handleCustomError(mes.adminApprovalReq, language);
      }
      if (!member.isProfile) {
        const location = {
          type: "Point",
          coordinates: [
            Number(member?.longitude || longitude),
            Number(member?.latitude || latitude),
          ],
        };

        const finalSocialLinks = await memberServices.addSocialLink(
          member,
          socialLinks,
          language,
        );

        let photoGallery: any;
        if (req.files?.photoGallery) {
          const files = Array.isArray(req.files.photoGallery)
            ? req.files.photoGallery
            : [req.files.photoGallery];

          const uploadPromises = files.map((file) =>
            uploadToS3(file, "member/photo-gallery"),
          );
          photoGallery = await Promise.all(uploadPromises);
        }

        const profileData = {
          memberId,
          skillIds: member?.skillIds,
          workDescription,
          businessTradingName: member?.businessTradingName,
          categoryId: member?.categoryId,
          latitude: member?.latitude || latitude,
          longitude: member?.longitude || longitude,
          overview,
          workLocation,
          photoGallery,
          country,
          // longitude,
          // latitude,
          location,
          socialLinks: finalSocialLinks,
        };

        const newProfile = await memberServices.createProfile(
          member,
          profileData,
        );
        sendResponse(res, newProfile, mes.profileCreated);
      } else {
        throw await handleCustomError(mes.profileAlreadyCreated, language);
      }
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async viewPersonalProfile(req: any, res: express.Response) {
    try {
      const { _id: memberId } = req.user_data;
      const profile = await handleMemberDetails(Models.Member, memberId);
      sendResponse(res, profile, mes.requestCompleted);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  // static async createQuote(req: any, res: express.Response) {
  //   try {
  //     const {
  //       jobId,
  //       clientId,
  //       profileId,
  //       description,
  //       language = mes.lang,
  //     } = req.body;
  //     const { _id: memberId } = req.user_data;

  //     const projection = { __v: 0 };
  //     const options = { lean: true };

  //     const existingQuote = await Models.Quote.findOne({
  //       jobId,
  //       memberId,
  //       profileId,
  //     }).lean();

  //     if (existingQuote) {
  //       throw await handleCustomError(mes.quoteAlreadyCreated, language);
  //     }

  //     const member: any = await Models.Member.findById(memberId).lean();
  //     if (!member) {
  //       throw await handleCustomError(mes.mNotFound, language);
  //     }

  //     const startOfMonth = moment().utc().startOf("month");
  //     const activeQuotesCount = await Models.Quote.countDocuments({
  //       memberId,
  //       createdAt: { $gte: startOfMonth },
  //     });

  //     const membershipQuoteLimits: any = {
  //       Free: 1,
  //       Basic: 4,
  //       Premium: Infinity,
  //     };

  //     const maxQuotes = membershipQuoteLimits[member.membership] || 0;

  //     if (maxQuotes !== Infinity && activeQuotesCount >= maxQuotes) {
  //       throw await handleCustomError(
  //         `You have reached the monthly quote limit`,
  //         language,
  //       );
  //     }

  //     const job: any = await Models.ClientJob.findById(jobId)
  //       .populate("postedBy")
  //       .lean();

  //     if (!job) {
  //       throw await handleCustomError("Data not found", language);
  //     }

  //     if (job.isDeleted) {
  //       throw await handleCustomError(
  //         "This job is no longer available",
  //         language,
  //       );
  //     }

  //     const now = moment().utc();

  //     if (job.startDate && now.isBefore(moment(job.startDate))) {
  //       throw await handleCustomError("Job has not started yet", language);
  //     }

  //     if (job.closingDate && now.isAfter(moment(job.closingDate))) {
  //       throw await handleCustomError("Job has expired", language);
  //     }

  //     let uploadFile: any = null;
  //     if (req.files?.file) {
  //       uploadFile = await uploadToS3(req.files.file, "quotes/file");
  //     }
  //     const newQuote = await Models.Quote.create({
  //       jobId,
  //       description,
  //       clientId,
  //       memberId,
  //       profileId,
  //       file: uploadFile,
  //     });

  //     sendResponse(res, newQuote, mes.quoteCreated);

  //     const quoteMailData = {
  //       email: job?.postedBy?.email || "",
  //       memberName: member?.fullName,
  //       memberEmail: member?.email,
  //       jobTitle: job?.projectTitle || "Your Job",
  //       description: newQuote.description,
  //       createdAt: new Date().toLocaleString(),
  //       membershipType: member?.membership || "N/A",
  //       jobLink: `${process.env.FRONTEND_URL}/client-job-listing`,
  //       fileUrl: newQuote?.file || "",
  //       companyName: "Skills$Trades",
  //     };

  //     await emailServices.quoteCreatedMail(quoteMailData);
  //   } catch (error) {
  //     handleCatch(res, error);
  //   }
  // }

  static async createQuote(req: any, res: express.Response) {
    try {
      const { _id: memberId } = req.user_data;
      const quoteData = req.body;
      const file = req.files?.file || null;
      const newQuote = await memberServices.createQuoteForMember({
        memberId,
        quoteData,
        file,
      });

      sendResponse(res, newQuote, mes.quoteCreated);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberListWithProfileCount(req: any, res: express.Response) {
    const { type, offset, limit } = helpers.customBodyParser(req.body);

    try {
      const list = await handleMemberListWithProfileCount(
        Models.Member,
        offset,
        limit,
        type,
      );
      const dataWithPagination = helpers.dataWithPagination(
        list,
        offset,
        limit,
      );
      sendResponse(res, dataWithPagination, mes.requestCompleted);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async allCategory(req: any, res: express.Response) {
    try {
      let query = {};
      let projection = { __v: 0 };
      let options = { lean: true };

      const fetch_data = await DAO.getData(
        Models.Category,
        query,
        projection,
        options,
      );
      sendResponse(res, fetch_data, mes.categoriesFetched);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async createRating(req: any, res: express.Response) {
    try {
      const { rating, clientId, review, jobId, language = mes.lang } = req.body;
      const projection = { __v: 0 };
      const query = { jobId };
      const options = { lean: true };
      const fetch_data = await DAO.getSingleData(
        Models.MemberRating,
        query,
        projection,
        options,
      );
      if (fetch_data) {
        throw await handleCustomError("MEMBER_ALREDY_RATE", language);
      }
      const rating_data = await Models.MemberRating.create({
        rating,
        review,
        jobId: new Types.ObjectId(jobId),
        clientId: new Types.ObjectId(clientId),
        memberId: req.user_data?._id,
      });

      sendResponse(res, rating_data, "Successfully Created");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async jobListing(req: any, res: express.Response) {
    try {
      const { type, limit, offset } = helpers.customBodyParser(req.body);
      
      const list = await handleJobList(Models.ClientJob, limit, offset, type);
      const dataWithPagination = helpers.dataWithPagination(
        list,
        offset,
        limit,
      );
      sendResponse(res, dataWithPagination, mes.requestCompleted);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async skillDetalsWithReviewList(req: any, res: express.Response) {
    try {
      const { id: profileId } = req.params;
      const details = await profileWithReview(Models.Profile, profileId);
      sendResponse(res, details, mes.requestCompleted);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getSkillsByCategory(req: any, res: express.Response) {
    try {
      const { categoryId } = req.body;
      if (!categoryId) {
        throw await handleCatch(mes.categoryReq, mes.lang);
      }
      const query = { categoryId };
      const projection = { __v: 0 };
      const options = { lean: true };
      const listing: any = await DAO.getData(
        Models.Skill,
        query,
        projection,
        options,
      );
      sendResponse(res, listing, mes.requestCompleted);
    } catch (error) {
      handleCatch(res, error);
    }
  }
  static async memberEditProfile1(req: any, res: express.Response) {
    const memberId = req.user_data?._id;
    const member = req.user_data;

    try {
      const {
        id: profileId,
        socialLinks,
        skillIds,
        categoryId,
        longitude,
        latitude,
        ...body
      } = req.body;

      const MEMBER_FIELDS = helpers.MEMBER_FIELDS;
      const PROFILE_FIELDS = helpers.PROFILE_FIELDS;

      const profile: any = await Models.Profile.findOne({
        _id: profileId,
        memberId,
      });

      if (!profile) {
        throw await handleCustomError(mes.profileNotFound, mes.lang);
      }

      const diff: any = {
        memberId,
        profileId: profile._id,
      };

      MEMBER_FIELDS.forEach((field) => {
        if (
          body[field] !== undefined &&
          JSON.stringify(body[field]) !== JSON.stringify(member[field])
        ) {
          diff[field] = body[field];
        }
      });

      PROFILE_FIELDS.forEach((field) => {
        if (
          body[field] !== undefined &&
          JSON.stringify(body[field]) !== JSON.stringify(profile[field])
        ) {
          diff[field] = body[field];
        }
      });

      let parsedSocialLinks = socialLinks;

      if (typeof socialLinks === "string") {
        try {
          parsedSocialLinks = JSON.parse(socialLinks);
        } catch {
          parsedSocialLinks = {};
        }
      }

      if (parsedSocialLinks && Object.keys(parsedSocialLinks).length) {
        if (member.membership !== mes.premium) {
          throw await handleCustomError(
            mes.premiumRequiredForSocialLinks,
            mes.lang,
          );
        }

        const allowedKeys = [
          "facebook",
          "instagram",
          "linkedin",
          "tiktok",
          "twitter",
          "website",
          "youtube",
        ];

        const cleanedLinks: any = {};

        allowedKeys.forEach((key) => {
          if (parsedSocialLinks[key] !== undefined) {
            cleanedLinks[key] = parsedSocialLinks[key];
          }
        });

        diff.socialLinks = {
          ...(profile.socialLinks?.toObject?.() || {}),
          ...cleanedLinks,
        };
      }

      let updatedPhotoGallery: any;

      if (req.files?.photoGallery) {
        const files = Array.isArray(req.files.photoGallery)
          ? req.files.photoGallery
          : [req.files.photoGallery];

        const uploadPromises = files.map((file: any) =>
          uploadToS3(file, "member/photo-gallery"),
        );

        updatedPhotoGallery = await Promise.all(uploadPromises);
      }

      if (updatedPhotoGallery) {
        diff.photoGallery = updatedPhotoGallery;
      }

      if (skillIds && Array.isArray(skillIds)) {
        diff.skillIds = skillIds.map((id: string) => new Types.ObjectId(id));
      }

      if (longitude !== undefined && latitude !== undefined) {
        const lat = Number(latitude);
        const lng = Number(longitude);

        diff.latitude = lat;
        diff.longitude = lng;
        diff.location = {
          type: "Point",
          coordinates: [lng, lat],
        };
      }

      if (categoryId) {
        diff.categoryId = new Types.ObjectId(categoryId);
      }

      if (Object.keys(diff).length === 2) {
        return sendResponse(res, null, mes.noChangesDetected);
      }

      profile.changes = diff;
      profile.status = mes.pending;
      await profile.save();

      await Models.Notifications.create({
        type: "member_profile_update",
        title: "Member Profile Update Requested",
        message: `Member ${member.fullName} has submitted profile changes for approval.`,
        data: { memberId, profileId, details: diff },
      });

      return sendResponse(res, diff, mes.profileUpdatePendingApproval);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberEditProfile(req: any, res: express.Response) {
    const memberId = req.user_data?._id;
    const member = req.user_data;

    try {
      const {
        id: profileId,
        socialLinks,
        skillIds,
        categoryId,
        longitude,
        latitude,
        ...body
      } = req.body;

      const MEMBER_FIELDS = helpers.MEMBER_FIELDS;
      const PROFILE_FIELDS = helpers.PROFILE_FIELDS;

      const profile: any = await Models.Profile.findOne({
        _id: profileId,
        memberId,
      });

      if (!profile) {
        throw await handleCustomError("Profile not found", "ENGLISH");
      }

      const diff: any = {
        memberId,
        profileId: profile._id,
      };

      MEMBER_FIELDS.forEach((field) => {
        if (
          body[field] !== undefined &&
          JSON.stringify(body[field]) !== JSON.stringify(member[field])
        ) {
          diff[field] = body[field];
        }
      });

      PROFILE_FIELDS.forEach((field) => {
        if (
          body[field] !== undefined &&
          JSON.stringify(body[field]) !== JSON.stringify(profile[field])
        ) {
          diff[field] = body[field];
        }
      });

      if (socialLinks) {
        if (member.membership !== "Premium") {
          throw await handleCustomError(
            "Only premium members can update social links...",
            "ENGLISH",
          );
        }

        let parsedSocialLinks = socialLinks;
        if (typeof socialLinks === "string") {
          try {
            parsedSocialLinks = JSON.parse(socialLinks);
          } catch (err) {
            throw await handleCustomError(
              "Invalid socialLinks format",
              "ENGLISH",
            );
          }
        }

        diff.socialLinks = {
          ...(profile.socialLinks?.toObject?.() || {}),
          ...parsedSocialLinks,
        };
      }

      let updatedPhotoGallery: any;

      if (req.files?.photoGallery) {
        const files = Array.isArray(req.files.photoGallery)
          ? req.files.photoGallery
          : [req.files.photoGallery];

        const uploadPromises = files.map((file: any) =>
          uploadToS3(file, "member/photo-gallery"),
        );

        updatedPhotoGallery = await Promise.all(uploadPromises);
      }

      if (updatedPhotoGallery) {
        diff.photoGallery = updatedPhotoGallery;
      }

      let parsedSkillIds = skillIds;

      if (typeof skillIds === "string") {
        try {
          parsedSkillIds = JSON.parse(skillIds); // expecting '["id1","id2"]'
        } catch (err) {
          parsedSkillIds = skillIds.split(",").map((id) => id.trim());
        }
      }

      if (Array.isArray(parsedSkillIds)) {
        diff.skillIds = parsedSkillIds.map((id) => new Types.ObjectId(id));
      }

      if (longitude !== undefined && latitude !== undefined) {
        const lat = Number(latitude);
        const lng = Number(longitude);

        diff.latitude = lat;
        diff.longitude = lng;
        diff.location = {
          type: "Point",
          coordinates: [lng, lat],
        };
      }

      if (categoryId) {
        diff.categoryId = new Types.ObjectId(categoryId);
      }

      if (Object.keys(diff).length === 2) {
        return sendResponse(res, null, "No changes detected");
      }

      profile.changes = diff;
      profile.status = "pending";
      await profile.save();

      return sendResponse(
        res,
        diff,
        "Profile update submitted for admin approval",
      );
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberProfileListWithReview(req: any, res: express.Response) {
    try {
      const memberId = new Types.ObjectId(req.user_data?._id);
      const list = await handleProfileListWithReview(Models.Member, memberId);

      sendResponse(res, list, "Data fetched successfully.");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberProfileListForLocation(req: any, res: express.Response) {
    try {
      const { limit, offset, longitude, latitude, distance, skillId } =
        helpers.customBodyParser(req.body);
      if (!skillId) {
        throw await handleCustomError("please provoie skill id", mes.lang);
      }
      const skillList = await handleProfileListWithLocation(
        Models.Profile,
        limit,
        offset,
        longitude,
        latitude,
        distance,
        skillId,
      );
      const dataWithPagination = helpers.dataWithPagination(
        skillList,
        offset,
        limit,
      );
      sendResponse(res, dataWithPagination, "Data fetched successfully.");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async advisoryList(req: any, res: express.Response) {
    try {
      const {
        id: categoryId,
        offset,
        limit,
        type,
        language = mes.lang,
      } = helpers.customBodyParser(req.body);
      if (!categoryId) {
        throw await handleCustomError(mes.categoryReq, language);
      }
      const listPromise = await handleAdvisoryList(
        Models.Advisory,
        categoryId,
        type,
        offset,
        limit,
      );
      const dataWithPagination = helpers.dataWithPagination(
        listPromise,
        offset,
        limit,
      );
      const categoryPromise = DAO.getSingleData(
        Models.Category,
        { _id: categoryId },
        { title: 1, icon: 1 },
        { lean: true },
      );

      const [list, category]: any = await Promise.all([
        dataWithPagination,
        categoryPromise,
      ]);

      const data: any = {
        _id: category._id,
        title: category.title,
        icon: category.icon,
        advisories: list,
      };
      sendResponse(res, data, "Data fetched successfully.");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getMemberJobs(req: any, res: express.Response) {
    try {
      const { _id: memberId } = req.user_data;
      const {type}=req.body;
      console.log("type>>>>>",type)
      console.log("memberId>>>",memberId)
      const list = await Models.Quote.aggregate([
        {
          $match: {
            memberId: new Types.ObjectId(memberId),
            clientAction: "accepted",
          },
        },
        {
          $lookup: {
            from: "members",
            localField: "memberId",
            foreignField: "_id",
            as: "member",
          },
        },
        {
          $unwind: {
            path: "$member",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "clientjobs",
            localField: "jobId",
            foreignField: "_id",
            as: "job",
          },
        },
        {
          $unwind: {
            path: "$job",
            preserveNullAndEmptyArrays: true,
          },
        },
        ...(type ? [{ $match: { "job.type": type } }] : []),
        {
          $lookup: {
            from: "clientratings",
            localField: "_id",
            foreignField: "quoteId",
            as: "rating",
          },
        },
        {
          $unwind: {
            path: "$rating",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $unwind: {
            path: "$client",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            file: 1,
            clientAction: 1,
            isJobDone: 1,
            createdAt: 1,
            updatedAt: 1,
            fullName: "$member.fullName",
            jobTittle: "$job.projectTitle",
            jobDescription: "$job.projectDescription",
            JobId: "$job._id",
            rating: "$rating.rating",
            review: "$rating.review",
            clientName: "$client.fullName",
          },
        },
      ]);
      sendResponse(res, list, "Successfully fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getPlan(req: any, res: express.Response) {
    try {
      const plan = await Models.Plan.find({});
      sendResponse(res, plan, "success");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async contactUs(req: any, res: express.Response) {
    try {
      const { fullName, email, message, phoneNumber } = req.body;
      if (!fullName || !email || !message || !phoneNumber) {
        throw await handleCustomError(
          "fullName,email,message are required",
          "ENGLISH",
        );
      }
      const contact_us = await Models.ContactUs.create({
        fullName,
        email,
        phoneNumber,
        message,
      });
      console.log(contact_us);
      sendResponse(res, contact_us, "Successfully");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberSubscriptionDuration(req: any, res: express.Response) {
    try {
      const member = req.user_data;
      const memberId = member?._id;
     
      const detalis = await Models.Subscription.aggregate([
        {
          $match: {
            memberId: new Types.ObjectId(memberId),
            status: "active",
          },
        },
        {
          $lookup: {
            from: "members",
            localField: "memberId",
            foreignField: "_id",
            as: "memberData",
          },
        },
        {
          $unwind:{
            path:"$memberData",
            preserveNullAndEmptyArrays:true
          }
        },
        {
          $lookup: {
            from: "plans",
            localField: "planId",
            foreignField: "_id",
            as: "planData",
          },
        },
        {
          $project: {
            __v: 0,
          },
        },
      ]);
      sendResponse(res, detalis, "Data fetched successfully.");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberSubscriptionDuration1(req: any, res: express.Response) {
    try {
      const memberId = req.user_data?._id;

      const subscription: any = await Models.Subscription.findOne({
        memberId,
        status: "active",
      }).lean();

      if (!subscription) {
        throw await handleCustomError("No active subscription", "ENGLISH");
        // return sendResponse(res, null, "No active subscription");
      }

      const now = moment();
      console.log("now", now);
      const endDate = moment(subscription.next_billing_date);

      // const now = new Date();
      // const endDate = new Date(subscription.next_billing_date);

      // let totalDaysLeft = Math.max(
      //   Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      //   0
      // );

      // const monthsLeft = Math.floor(totalDaysLeft / 30);
      // const daysLeft = totalDaysLeft % 30;

      const response = {
        plan: subscription.plan,
        status: subscription.status,
        startDate: subscription.start_date,
        nextBillingDate: subscription.next_billing_date,
        // monthsLeft,
        // daysLeft,
        // totalDaysLeft,
      };

      sendResponse(res, response, "Subscription duration fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getMySubscription(req: any, res: express.Response) {
    try {
      const memberId = req.user_data.id;

      const subscription: any = await Models.Subscription.findOne({
        memberId,
        status: "active",
      }).populate("planId");

      if (!subscription) {
        return res.status(404).json({ message: "No active subscription" });
      }

      const now = new Date();
      const remainingDays = Math.max(
        0,
        Math.ceil(
          (subscription.endDate.getTime() - now.getTime()) /
            (1000 * 60 * 60 * 24),
        ),
      );

      res.json({
        plan: subscription.planId,
        status: subscription.status,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        remainingDays,
      });
    } catch (error) {
      handleCatch(res, error);
    }
  }

}

export default memberController;
