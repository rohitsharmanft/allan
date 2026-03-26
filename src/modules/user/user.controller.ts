import express, { response } from "express";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";
import {
  handleCatch,
  handleCustomError,
  helpers,
  sendResponse,
} from "../../middlewares/index";
import userServices from "./user.services";
import { sendOTP } from "../../middlewares/email_services";
import * as emailServices from "../../middlewares/email_services";
import crypto from "crypto";
import moment from "moment";
import { Types } from "mongoose";
import { handleProfileListWithLocation } from "./user.aggregation";
import { uploadToS3 } from "../../middlewares/s3Client";
import { ALLOWED_QUOTE_ACTIONS, JOB_TYPE } from "../../config/constant";
import CLIENT_MESSAGES from "../../config/message/client_message";
import MEMBER_MESSAGES from "../../config/message/member_message";
import { title } from "process";
const mes = { ...MEMBER_MESSAGES, ...CLIENT_MESSAGES };

class userController {
  static async signUp(req: any, res: express.Response) {
    try {
      let createUser = await userServices.createUser(req.body);

      await sendOTP(createUser);

      await Models.Notifications.create({
        type: "client_registration",
        title: "New Client Registered",
        message: `A new client, ${createUser.fullName}, has joined the platform.`,
        data: { clientId: createUser._id },
      });

      sendResponse(res, createUser, CLIENT_MESSAGES.signup_success);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async sendOtp(req: any, res: express.Response) {
    try {
      let { email, language = mes.lang } = req.body;
      console.log(req.body);
      let query = { email: email.toLowerCase() };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Users,
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
          Models.Users,
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
      let response: any;
      let number = Math.floor(100000 + Math.random() * 900000);

      let query = { email: email.toLowerCase() };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Users,
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
            Models.Users,
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

  static async login(req: any, res: express.Response) {
    try {
      let { email, password: input_password, language = mes.lang } = req.body;
      let response: any;

      let query = { email: email.toLowerCase() };
      let projection = { __v: 0 };
      let options = { lean: true };
      let client: any = await DAO.getSingleData(
        Models.Users,
        query,
        projection,
        options,
      );
      if (!client) {
        throw await handleCustomError(mes.emailNotRegis, language);
      }

      let { _id, password } = client;

      let decryt = await helpers.decrypt_password(input_password, password);

      if (decryt !== true) {
        throw await handleCustomError(mes.incorrect_password, language);
      }

      if (!client.otpVerified) {
        throw await handleCustomError(mes.otp_not_verified, language);
      }
      if (client.adminApproval === mes.pending) {
        throw await handleCustomError(mes.approvalPending, language);
      }

      let generate_token = await userServices.generateUserToken(_id);
      response = await userServices.makeUserResponse(generate_token, language);
      let message = "Login Successfully";

      let resp = {
        client_details: {
          _id: response._id,
          email: response.email,
          phoneNumber: response.phoneNumber,
          fullName: response.fullName,
          access_token: response.access_token,
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
      let projection = { otp: 0 };
      let options = { lean: true };
      let response = await DAO.getSingleData(
        Models.Users,
        query,
        projection,
        options,
      );
      sendResponse(res, response, "Success");
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async edit(req: any, res: express.Response) {
    try {
      let { _id } = req.user_data;

      let file: string = null;
      if (req.files && req.files?.image) {
        file = await uploadToS3(req.files?.image, "client/profile");
      }

      let createUser = await userServices.editUser(_id, req.body, file || null);

      sendResponse(res, createUser, CLIENT_MESSAGES.profile_updated);
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
      let fetch_data: any = await userServices.verifyUser(query);

      if (fetch_data.length === 0) {
        throw await handleCustomError(mes.emailNotRegis, language);
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 mins
      if (fetch_data.length) {
        let { _id } = fetch_data[0];
        // let security_code = await helpers.gen_unique_code(Models.Users);

        let query = { _id: _id };
        let update = {
          resetToken,
          resetTokenExpiry,
        };
        let options = { new: true };
        let Update_data = await DAO.findAndUpdate(
          Models.Users,
          query,
          update,
          options,
        );
        await emailServices.userForgetPasswordMail(Update_data);

        sendResponse(res, null, mes.resetLink);
      } else {
        throw await handleCustomError(mes.emailNotRegis, language);
      }
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async checkSecurityCode(req: any, res: express.Response) {
    try {
      let { resetToken, language = mes.lang } = req.body;
      if (!resetToken) {
        throw await handleCustomError(mes.resetTokenReq, language);
      }
      let query = { resetToken: resetToken };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Users,
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

  static async setNewPassword(req: any, res: express.Response) {
    try {
      const { password, resetToken, language = mes.lang } = req.body;

      if (!password) throw await handleCustomError(mes.passReq, language);
      if (!resetToken)
        throw await handleCustomError(mes.resetTokenReq, language);

      const user: any = await DAO.getData(
        Models.Users,
        { resetToken },
        { __v: 0 },
        { lean: true },
      );

      if (!user.length)
        throw await handleCustomError(mes.resetTokenExp, language);

      const userData = user[0];

      if (
        !userData.resetTokenExpiry ||
        userData.resetTokenExpiry < Date.now()
      ) {
        throw await handleCustomError(mes.resetTokenExp, language);
      }

      const hashedPassword = await helpers.bcrypt_password(password);

      await DAO.findAndUpdate(
        Models.Users,
        { _id: userData._id },
        {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiry: null,
        },
        { new: true },
      );

      sendResponse(res, null, "New Password Set Successfully");
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async changePassword(req: any, res: express.Response) {
    try {
      const { old_password, new_password, language = mes.lang } = req.body;
      const user_id = req.user_data._id;

      await userServices.changePassword(
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

  static async createJob(req: any, res: express.Response) {
    try {
      const {
        categoryId,
        skillIds,
        projectTitle,
        projectDescription,
        location,
        city,
        type,
        startDate,
        closingDate,
        language = mes.lang,
      } = req.body;
      const { _id: id } = req.user_data;

      if (!Object.values(JOB_TYPE).includes(type)) {
        throw await handleCustomError(mes.inValidType, language);
      }
      if (!categoryId) {
        throw await handleCustomError(mes.categoryReq, language);
      }
      if (!skillIds) {
        throw await handleCustomError(mes.skillReq, language);
      }

      let uploadFile: any;
      if (req.files && req.files?.uploadImage) {
        uploadFile = await uploadToS3(req.files?.uploadImage, "job/images");
      }
      const skill = skillIds && JSON.parse(skillIds);
      const newJob = await Models.ClientJob.create({
        categoryId,
        skillIds: skill,
        postedBy: id,
        projectTitle,
        projectDescription,
        location,
        city,
        startDate,
        closingDate,
        uploadImage: uploadFile,
        type,
      });
      await Models.Notifications.create({
        type: type === mes.job ? mes.jobPosted : mes.projectPosted,
        title: type === mes.job ? mes.newJobPost : mes.newProjectPost,
        message: `A new ${type}, '${projectTitle}', has been posted by ${req.user_data.fullName}.`,
        data: { jobId: newJob._id, postedBy: id },
      });
      const adminEmail = process.env.ADMIN_EMAIL;
      sendResponse(res, newJob, mes.jobCreated);
      const data = {
        title: projectTitle,
        email: adminEmail,
        userName: req.user_data?.fullName,
        type: type,
        city,
        location,
        startDate,
        closingDate,
      };
      await emailServices.jobCreateMail(data);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async deleteJob(req: any, res: express.Response) {
    try {
      const { id, language = mes.lang } = req.body;

      if (!id) {
        throw await handleCustomError(mes.jobRequired, language);
      }

      const { _id: clientId } = req.user_data;

      const query = { _id: id, postedBy: clientId };
      const projection = { __v: 0 };
      const options = { lean: true };

      const existingJob: any = await DAO.getSingleData(
        Models.ClientJob,
        query,
        projection,
        options,
      );

      if (!existingJob) {
        throw await handleCustomError(mes.jobNotFoundOrAccessDenied, language);
      }

      if (existingJob.isDeleted) {
        throw await handleCustomError(mes.jobAlreadyDeleted, language);
      }

      const update_data = {
        isDeleted: true,
        deletedBy: mes.client,
        deletedAt: new Date(),
      };

      const update_job = await DAO.findAndUpdate(
        Models.ClientJob,
        query,
        update_data,
        { new: true },
      );

      sendResponse(res, null, mes.deleteJob);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async createRating(req: any, res: express.Response) {
    try {
      const {
        rating,
        memberId,
        review,
        memberProfileId,
        jobId,
        quoteId,
        language = mes.lang,
      } = req.body;

      const requiredFields = {
        rating,
        review,
        memberId,
        memberProfileId,
        quoteId,
        jobId,
      };
      for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
          throw await handleCustomError(
            `${key.toUpperCase()} is required`,
            language,
          );
        }
      }

      const query = { memberProfileId, jobId, memberId, quoteId };
      const rating_data = await Models.ClientRating.findOneAndUpdate(
        {
          clientId: req.user_data?._id,
          ...query,
        },
        { rating, review },
        { upsert: true },
      );
      sendResponse(res, rating_data, mes.ratingDone);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberQuoteList(req: any, res: express.Response) {
    try {
      const { id, offset, limit } = helpers.customBodyParser(req.body);
      if (!id) {
        throw await handleCustomError(mes.jobRequired, mes.lang);
      }

      const quoteList: any = await Models.Quote.aggregate([
        {
          $match: {
            jobId: new Types.ObjectId(id),
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
          $unwind: {
            path: "$memberData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "profileId",
            foreignField: "_id",
            as: "profileData",
          },
        },
        {
          $unwind: {
            path: "$profileData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            description: 1,
            file: 1,
            createdAt: 1,
            memberId: "$memberId",
            fullName: "$memberData.fullName",
            email: "$memberData.email",
            phoneNumber: "$memberData.phoneNumber",
            whatsappNumber: "$memberData.whatsappNumber",
            profileId: "$profileData._id",
            skill: "$profileData.skill",
            businessTradingName: "$profileData.businessTradingName",
            overview: "$profileData.overview",
            clientAction: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);
      const dataWithPagination: any = helpers.dataWithPagination(
        quoteList,
        offset,
        limit,
      );
      // if (quoteList[0]?.data?.length < 3) {
      //   sendResponse(res, null, mes.quotesNotEnough);
      // } else {
      sendResponse(res, dataWithPagination, mes.skillsFetched);
      // }
    } catch (error) {
      handleCatch(res, error);
    }
  }

  // static async memQuoteListByJob(req: any, res: express.Response) {
  //   try {
  //     const { id, offset, limit } = helpers.customBodyParser(req.body);
  //     const quoteList = await Models.ClientJob.aggregate([
  //       {
  //         $match: { _id: new Types.ObjectId(id) },
  //       },
  //       {
  //         $lookup: {
  //           from: "quotes",
  //           localField: "_id",
  //           foreignField: "jobId",

  //           pipeline: [
  //             {
  //               $lookup: {
  //                 from: "members",
  //                 localField: "memberId",
  //                 foreignField: "_id",
  //                 as: "memberData",
  //               },
  //             },
  //             {
  //               $lookup: {
  //                 from: "profiles",
  //                 localField: "profileId",
  //                 foreignField: "_id",
  //                 as: "profileData",
  //               },
  //             },
  //           ],
  //           as: "quoteData",
  //         },
  //       },
  //       {
  //         $project: {
  //           _id: 1,
  //           projectTitle: 1,
  //           projectDescription: 1,
  //           startDate: 1,
  //           quoteData: 1,
  //         },
  //       },
  //       {
  //         $facet: {
  //           data: [{ $skip: offset }, { $limit: limit }],
  //           totalCount: [{ $count: "count" }],
  //         },
  //       },
  //     ]);
  //     const dataWithPagination: any = helpers.dataWithPagination(
  //       quoteList,
  //       offset,
  //       limit
  //     );
  //     console.log("quoteList>>>>>>", quoteList);
  //     sendResponse(res, dataWithPagination, "Successfully fetched");
  //   } catch (error) {
  //     handleCatch(res, error);
  //   }
  // }

  static async memberSkillListing(req: any, res: express.Response) {
    try {
      const { offset, limit } = helpers.customBodyParser(req.body);
      const listing = await Models.Profile.aggregate([
        {
          $lookup: {
            from: "skills",
            localField: "skillIds",
            foreignField: "_id",
            as: "skillData",
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
          $unwind: {
            path: "$memberData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "clientratings",
            localField: "_id",
            foreignField: "memberProfileId",
            as: "ratings",
          },
        },
        {
          $project: {
            _id: 1,
            skill: "$skillData.title",
            // skillData
            workDescription: 1,
            categoryId: 1,
            workLocation: 1,
            experience: 1,
            businessTradingName: 1,
            fullName: "$memberData.fullName",
            phoneNumber: "$memberData.phoneNumber",
            // memberData: 1,
            ratings: 1,
            // rating:"$ratings.rating",
            // review:"$ratings.review"
          },
        },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);
      const dataWithPagination = helpers.dataWithPagination(
        listing,
        offset,
        limit,
      );

      sendResponse(res, dataWithPagination, "Successfully fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async clientActionForQuote(req: any, res: express.Response) {
    try {
      const { id, type, language = mes.lang } = req.body;
      const options = { lean: true };

      if (!ALLOWED_QUOTE_ACTIONS.includes(type)) {
        throw await handleCustomError(mes.inValidType, language);
      }

      const quote: any = await DAO.getSingleData(
        Models.Quote,
        { _id: id },
        { __v: 0 },
        options,
      );

      if (!quote) {
        throw await handleCustomError(mes.quoteNotFound, language);
      }

      if (ALLOWED_QUOTE_ACTIONS.includes(quote.clientAction)) {
        throw await handleCustomError(mes.quoteAlreadyActioned, language);
      }

      const job: any = await DAO.getSingleData(
        Models.ClientJob,
        { _id: quote.jobId, isDeleted: false },
        { _id: 1, title: 1 },
        options,
      );

      if (!job) {
        throw await handleCustomError(mes.jobNotFoundOrDeleted, language);
      }

      const fetch_member: any = await DAO.getSingleData(
        Models.Member,
        { _id: quote.memberId },
        { _id: 1, fullName: 1, membership: 1, email: 1 },
        options,
      );

      if (!fetch_member) {
        throw await handleCustomError(mes.mNotFound, language);
      }

      const update_data = await DAO.findAndUpdate(
        Models.Quote,
        { _id: quote._id, clientAction: mes.pending },
        { clientAction: type },
        { new: true },
      );

      if (!update_data) {
        throw await handleCustomError(mes.quoteAlreadyActioned, language);
      }

      await emailServices.clientActionInQuote({ ...fetch_member, type });

      // await emailServices.clientActionInQuote({
      //   member: fetch_member,
      //   quoteId: quote._id,
      //   jobId: quote.jobId,
      //   action: type,
      // });

      sendResponse(res, update_data, "Successfully updated");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async clientActionForQuote1(req: any, res: express.Response) {
    try {
      const { id, type, language = mes.lang } = req.body;
      const options = { lean: true };
      const projection = { __v: 0 };

      if (!["accepted", "rejected"].includes(type)) {
        throw await handleCustomError("Invalid type", language);
      }

      const quote: any = await DAO.getSingleData(
        Models.Quote,
        { _id: id },
        projection,
        options,
      );

      if (!quote) {
        throw await handleCustomError("Quote not found", language);
      }

      const member: any = await DAO.getSingleData(
        Models.Member,
        { _id: quote.memberId },
        projection,
        options,
      );

      if (!member) {
        throw await handleCustomError(mes.mNotFound, language);
      }

      if (type === mes.accepted) {
        const profiles: any = await DAO.getData(
          Models.Profile,
          { memberId: member._id },
          { _id: 1 },
          { lean: true },
        );
        const profileIds = profiles.map((p: any) => p._id);
        const today = moment().utc();
        const oneMonthAgo = today.subtract(1, "month").toDate();
        // const today = moment().utc().toDate();

        const activeJobsCount = await Models.Quote.countDocuments({
          profileId: { $in: profileIds },
          clientAction: "accepted",
          createdAt: { $gte: oneMonthAgo, $lte: today },
        });

        console.log("activeJobsCount last 1 month:", activeJobsCount);

        const membershipJobLimits = {
          Free: 1,
          Basic: 3,
          Premium: Infinity,
        };

        const maxJobs = membershipJobLimits[member.membership];
        if (maxJobs === undefined) {
          throw await handleCustomError("Invalid membership type", language);
        }

        if (activeJobsCount >= maxJobs) {
          throw await handleCustomError(
            `This member has reached the maximum allowed jobs in the last month (${maxJobs}).`,
            language,
          );
        }
      }
      const updatedQuote = await DAO.findAndUpdate(
        Models.Quote,
        { _id: quote._id },
        { clientAction: type },
        { new: true },
      );
      await emailServices.clientActionInQuote({ ...member, type });
      sendResponse(res, updatedQuote, "Successfully updated");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getUserJobs(req: any, res: express.Response) {
    try {
      const { type } = req.body;
      const { _id: clientId } = req.user_data;
      if (!type) {
        throw await handleCustomError("Please provoide type", "ENGLISH");
      }

      const jobList = await Models.ClientJob.aggregate([
        {
          $match: {
            postedBy: new Types.ObjectId(clientId),
            type: type,
            isDeleted: false,
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryData",
          },
        },
        {
          $unwind: {
            path: "$categoryData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "skills",
            localField: "skillIds",
            foreignField: "_id",
            as: "skillData",
          },
        },

        {
          $project: {
            _id: 1,
            categoryId: 1,
            projectTitle: 1,
            uploadImage: 1,
            type: 1,
            projectDescription: 1,
            createdAt: 1,
            categoryName: "$categoryData.title",
            categoryDescription: "$categoryData.description",
            categoryicon: "$categoryData.icon",
            skillName: "$skillData.title",
            isDeleted: 1,
            startDate: 1,
            closingDate: 1,
            location: 1,
            city: 1,
          },
        },
      ]);
      sendResponse(res, jobList, "Succesfully fetch");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async jobDetails(req: any, res: express.Response) {
    try {
      const { id: jobId } = req.params;
      if (!jobId) {
        throw await handleCustomError("JOB_ID_REQUIRED", "ENGLISH");
      }
      const details = await Models.ClientJob.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(jobId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "postedBy",
            foreignField: "_id",
            as: "clientData",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $unwind: {
            path: "$category",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "skills",
            localField: "skillIds",
            foreignField: "_id",
            as: "skillData",
          },
        },
        {
          $lookup: {
            from: "clientratings",
            localField: "_id",
            foreignField: "jobId",
            as: "rating",
          },
        },
        {
          $project: {
            id: 1,
            projectTitle: 1,
            projectDescription: 1,
            startDate: 1,
            categoryTitle: "$category.title",
            skillTitle: "$skillData.title",
            rating: "$rating.rating",
            review: "$rating.review",
          },
        },
      ]);
      sendResponse(res, details, "Successfully fetch");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getSkillsByCategory(req: any, res: express.Response) {
    try {
      const { categoryId } = req.body;
      const query = { categoryId };
      const projection = { __v: 0 };
      const options = { lean: true };
      const listing: any = await DAO.getData(
        Models.Skill,
        query,
        projection,
        options,
      );
      sendResponse(res, listing, "Successfully fetched");
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

      sendResponse(res, fetch_data, "Successfully fetched all Category");
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async memberProfileListForLocation(req: any, res: express.Response) {
    try {
      const { limit, offset, longitude, latitude, distance, skillId } =
        helpers.customBodyParser(req.body);

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
      sendResponse(res, dataWithPagination, "Successfully fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async skillListWithSearch(req: any, res: express.Response) {
    try {
      // const { search } = req.body;

      const list = await Models.Skill.aggregate([
        // ...(search
        //   ? [
        //       {
        //         $match: {
        //           title: { $regex: search.trim(), $options: "i" },
        //         },
        //       },
        //     ]
        //   : []),
        {
          $project: {
            __v: 0,
          },
        },
      ]);
      sendResponse(res, list, "Successfully fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async clientReview(req: any, res: express.Response) {
    try {
      const clientId = req.user_data?._id;
      const list = await Models.ClientRating.aggregate([
        {
          $match: {
            clientId: new Types.ObjectId(clientId),
            // jobId: new Types.ObjectId(id),
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
          $unwind: {
            path: "$memberData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "memberProfileId",
            foreignField: "_id",
            as: "profileData",
          },
        },
        {
          $unwind: {
            path: "$profileData",
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
        {
          $project: {
            _id: 1,
            rating: 1,
            review: 1,
            status: 1,
            jobTitle: "$job.projectTitle",
            fullName: "$memberData.fullName",
            email: "$memberData.email",
            image: "$memberData.image",
            membership: "$memberData.membership",
            businessTradingName: "$profileData.businessTradingName",
            workLocation: "$profileData.workLocation",
          },
        },
      ]);
      sendResponse(res, list, "Successfully");
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
        language = "ENGLISH",
      } = helpers.customBodyParser(req.body);
      if (!categoryId) {
        throw await handleCustomError("Category is required", language);
      }
      const listPromise = await Models.Advisory.aggregate([
        {
          $match: {
            type: type,
            categoryId: new Types.ObjectId(categoryId),
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            image: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);
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

  static async markJobDone(req: any, res: express.Response) {
    try {
      const clientId = req.user_data?._id;
      const { id: quoteId } = req.params;
      const options = { lean: true };

      const quote: any = await DAO.getSingleData(
        Models.Quote,
        { _id: quoteId },
        { __v: 0 },
        options,
      );
      if (!quote) {
        throw await handleCustomError("JOB_NOT_FOUND_OR_DELETED", "ENGLISH");
      }
      if (quote.clientId.toString() !== clientId.toString()) {
        throw await handleCustomError("UNAUTHORIZED", "ENGLISH");
      }

      if (quote.isJobDone) {
        throw await handleCustomError("Job already marked as done", "ENGLISH");
      }
      const update_data = await DAO.findAndUpdate(
        Models.Quote,
        { _id: quoteId },
        {
          isJobDone: true,
        },
        { new: true },
      );

      sendResponse(res, null, "Job marked as completed successfully");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async quoteAcceptedListByClient(req: any, res: express.Response) {
    try {
      const { offset, limit } = helpers.customBodyParser(req.body);
      const clientId = req.user_data?._id;

      const quoteList = await Models.Quote.aggregate([
        {
          $match: {
            clientId: new Types.ObjectId(clientId),
            clientAction: "accepted",
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
          $unwind: {
            path: "$memberData",
            preserveNullAndEmptyArrays: true,
          },
        },
        // {
        //   $lookup: {
        //     from: "profiles",
        //     localField: "profileId",
        //     foreignField: "_id",
        //     as: "profileData",
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$profileData",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
        {
          $lookup: {
            from: "clientjobs",
            localField: "jobId",
            foreignField: "_id",
            as: "jobData",
          },
        },
        {
          $unwind: {
            path: "$jobData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            description: 1,
            file: 1,
            createdAt: 1,
            memberId: "$memberId",
            fullName: "$memberData.fullName",
            email: "$memberData.email",
            phoneNumber: "$memberData.phoneNumber",
            whatsappNumber: "$memberData.whatsappNumber",
            // profileId: "$profileData._id",
            // skill: "$profileData.skill",
            // businessTradingName: "$profileData.businessTradingName",
            // overview: "$profileData.overview",
            clientAction: 1,
            jobData: 1,
            isJobDone: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);
      const dataWithPagination: any = helpers.dataWithPagination(
        quoteList,
        offset,
        limit,
      );
      sendResponse(res, dataWithPagination, "Success");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async quoteDetail(req: any, res: express.Response) {
    try {
      const { id: quoteId } = req.params;
      const details = await Models.Quote.aggregate([
        {
          $match: {
            _id: new Types.ObjectId(quoteId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "clientData",
          },
        },
        {
          $unwind: {
            path: "$clientData",
            preserveNullAndEmptyArrays: true,
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
          $unwind: {
            path: "$memberData",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "profileId",
            foreignField: "_id",
            as: "profileData",
          },
        },
        {
          $unwind: {
            path: "$profileData",
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
        {
          $project: {
            description: 1,
            file: 1,
            createdAt: 1,
            memberId: "$memberData._id",
            fullName: "$memberData.fullName",
            email: "$memberData.email",
            phoneNumber: "$memberData.phoneNumber",
            whatsappNumber: "$memberData.whatsappNumber",
            profileId: "$profileData._id",
            // skill: "$profileData.skill",
            // businessTradingName: "$profileData.businessTradingName",
            // overview: "$profileData.overview",
            clientAction: 1,
            jobId: "$job._id",
            isJobDone: 1,
          },
        },
      ]);
      sendResponse(res, details, "Success");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async ratingDetails(req: any, res) {
    try {
      const { id: quoteId } = req.params;
      const detalis = await Models.ClientRating.aggregate([
        {
          $match: {
            quoteId: new Types.ObjectId(quoteId),
          },
        },
        // {
        //   $lookup: {
        //     from: "members",
        //     localField: "memberId",
        //     foreignField: "_id",
        //     as: "member",
        //   },
        // },
        // {
        //   $unwind: {
        //     path: "$member",
        //     preserveNullAndEmptyArrays: true,
        //   },
        // },
        {
          $project: {
            __v: 0,
          },
        },
      ]);

      sendResponse(res, detalis, "Successfully Fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }
}

export default userController;
