import express, { query } from "express";
import crypto from "crypto";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";
import {
  handleCatch,
  handleCustomError,
  helpers,
  sendResponse,
} from "../../middlewares/index";
import adminServices from "./admin.services";

import * as emailServices from "../../middlewares/email_services";
import mongoose, { Model, Types } from "mongoose";
import { uploadToS3 } from "../../middlewares/s3Client";
import {
  adminHandleAdvisoryList,
  adminHandleMemberDetailWithProfile,
  adminHandleMemberListWithProfileCount,
  adminMemberProfileListWithReview,
} from "./admin.aggration";
import moment from "moment";
import { ADVISORY_TYPES, JOB_TYPE } from "../../config/constant";
import MEMBER_MESSAGES from "../../config/message/member_message";
import adminMessage from "../../config/message/admin_message";
const mes = { ...MEMBER_MESSAGES, ...adminMessage };

class adminController {
  static async login(req: any, res: express.Response) {
    try {
      let { email, password: input_password, language = mes.lang } = req.body;
      let response: any;

      let query = { email: email.toLowerCase() };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Admin,
        query,
        projection,
        options,
      );

      if (!fetch_data[0]) {
        throw await handleCustomError(mes.email_not_found, language);
      }

      if (fetch_data.length) {
        let { _id, password } = fetch_data[0];

        let decryt = await helpers.decrypt_password(input_password, password);

        if (decryt !== true) {
          throw await handleCustomError(mes.incorrect_password, language);
        } else {
          let generate_token = await adminServices.generateAdminToken(_id);
          response = await adminServices.makeAdminResponse(
            generate_token,
            language,
          );
          let message = "Login Successfully";

          let resp = {
            user_details: {
              _id: response._id,
              email: response.email,
              phone_no: response.phone_no,
              name: response.name,
              access_token: response.access_token,
            },
            message: message,
          };
          sendResponse(res, resp, "Success");
        }
      } else {
        throw await handleCustomError(mes.email_not_found, language);
      }
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async viewProfile(req: any, res: express.Response) {
    try {
      let { _id: admin_id } = req.user_data;
      let query = { _id: admin_id };
      let projection = {
        password: 0,
        resetToken: 0,
        resetTokenExpiry: 0,
        __v: 0,
      };
      let options = { lean: true };
      let response = await DAO.getData(
        Models.Admin,
        query,
        projection,
        options,
      );
      if (!response[0]) {
        throw await handleCustomError(mes.profileNotFound, mes.lang);
      }
      let message = "Profile fetched successfully";
      sendResponse(res, response[0], message);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async updateProfile(req: any, res: any) {
    try {
      let _id = req.user_data._id;
      let file: string = null;
      if (req.files && req.files?.image) {
        file = await uploadToS3(req.files?.image, "admin/profile");
      }
      let data = await adminServices.updateAdmin(_id, req.body, file);

      sendResponse(res, null, "Profile updated successfully.");
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
      let fetch_data: any = await adminServices.verifyAdmin(query);
      console.log(fetch_data);
      if (fetch_data.length === 0) {
        throw await handleCustomError(mes.email_not_found, language);
      }

      // let message =
      //   "Forgot password link has been sent to your registered email address";

      if (fetch_data.length) {
        let { _id } = fetch_data[0];

        // token expiry (15 min)
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 mins

        let update = {
          resetToken,
          resetTokenExpiry,
        };

        await DAO.findAndUpdate(Models.Admin, { _id }, update, { new: true });

        await emailServices.adminForgetPasswordMail({
          ...fetch_data[0],
          resetToken,
        });
      }

      sendResponse(res, null, mes.resetLink);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  // static async setNewPassword(req: any, res: express.Response) {
  //   try {
  //     let { password, security_code, language } = req.body;
  //     let query = { security_code: security_code };
  //     let projection = { __v: 0 };
  //     let options = { lean: true };
  //     let fetch_data: any = await DAO.getData(
  //       Models.Admin,
  //       query,
  //       projection,
  //       options
  //     );

  //     if (fetch_data.length) {
  //       let { _id } = fetch_data[0];
  //       let bcrypt_password = await helpers.bcrypt_password(password);

  //       let query = { _id: _id };
  //       let update = { password: bcrypt_password };
  //       let options = { new: true };
  //       await DAO.findAndUpdate(Models.Admin, query, update, options);

  //       let message = "New Password Set Successfully";

  //       if (message) {
  //         let query = { _id: _id };
  //         let update = { security_code: null };
  //         let options = { new: true };
  //         await DAO.findAndUpdate(Models.Admin, query, update, options);
  //       }

  //       sendResponse(res, message, "Success");
  //     } else {
  //       throw await handleCustomError("LINK_EXPIRED", language);
  //     }
  //   } catch (err) {
  //     handleCatch(res, err);
  //   }
  // }

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
        Models.Admin,
        query,
        projection,
        options,
      );

      if (!fetch_data.length) {
        throw await handleCustomError(mes.invalidResetToken, language);
      }

      let admin = fetch_data[0];

      if (!admin.resetTokenExpiry || admin.resetTokenExpiry < Date.now()) {
        throw await handleCustomError(mes.resetTokenExp, language);
      }
      let hashedPassword = await helpers.bcrypt_password(password);

      let update = {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      };

      await DAO.findAndUpdate(Models.Admin, { _id: admin._id }, update, {
        new: true,
      });

      let message = "New Password Set Successfully";
      sendResponse(res, null, message);
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
        Models.Admin,
        query,
        projection,
        options,
      );
      console.log(fetch_data);
      if (fetch_data.length == 0) {
        throw await handleCustomError(mes.resetTokenExp, language);
      }
      sendResponse(res, null, mes.tokenWorking);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async changePassword(req: any, res: express.Response) {
    try {
      let { oldPassword, newPassword, language = mes.lang } = req.body;
      let { _id: admin_id } = req.user_data,
        session_data = req.session_data;

      let query = { _id: admin_id };
      let projection = { __v: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Admin,
        query,
        projection,
        options,
      );

      if (fetch_data.length) {
        let password = fetch_data[0].password;
        let decrypt = await helpers.decrypt_password(oldPassword, password);
        if (!decrypt == true) {
          throw await handleCustomError(mes.oldPasswordIncorrect, language);
        } else {
          let bcrypt = await helpers.bcrypt_password(newPassword);
          let query = { _id: admin_id };
          let update = { password: bcrypt };
          let options = { new: true };
          await DAO.findAndUpdate(Models.Admin, query, update, options);

          await adminServices.makeAdminResponse(session_data, language);
          sendResponse(res, null, "Password updated successfully.");
        }
      } else {
        throw await handleCustomError("UNAUTHORIZED", language);
      }
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async memberVerifiedByAdmin(req: any, res: express.Response) {
    try {
      const { id, type, language = "ENGLISH" } = req.body;
      let query = { _id: id };
      let projection = { __v: 0, password: 0 };
      let options = { lean: true };
      if (!["accepted", "rejected"].includes(type)) {
        throw await handleCustomError("Invalid type", language);
      }
      const member: any = await DAO.getSingleData(
        Models.Member,
        query,
        projection,
        options,
      );
      if (!member) {
        throw await handleCustomError("member not found", language);
      }
      const updatePayload = { adminApproval: type };
      let updatedMember: any;
      const loginLink = `${process.env.FRONTEND_URL}/login`;

      if (type === "accepted") {
        updatedMember = await DAO.findAndUpdate(
          Models.Member,
          { _id: member._id },
          updatePayload,
          options,
        );
        await emailServices.memberApplicationMail({
          ...member,
          loginLink,
        });
      } else if (type === "rejected") {
        updatedMember = await DAO.findAndUpdate(
          Models.Member,
          { _id: member._id },
          updatePayload,
          options,
        );
        await emailServices.memberApplicationRejectedMail({
          ...member,
        });
      }

      sendResponse(
        res,
        null,
        "Member verification status updated successfully",
      );
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberListWithProfileCount(req: any, res: express.Response) {
    const {
      type,
      membership,
      offset,
      limit,
      language = "ENGLISH",
    } = helpers.customBodyParser(req.body);

    try {
      const validAdminStatus = ["pending", "accepted", "rejected"];
      if (type && !validAdminStatus.includes(type)) {
        throw await handleCustomError(mes.invalidAdminApprovalType, language);
      }
      const validMembership = ["Free", "Basic", "Premium"];

      if (membership && !validMembership.includes(membership)) {
        throw await handleCustomError(mes.invalidMembershipType, language);
      }
      const list = await adminHandleMemberListWithProfileCount(
        Models.Member,
        offset,
        limit,
        type,
        membership,
      );
      const dataWithPagination = helpers.dataWithPagination(
        list,
        offset,
        limit,
      );
      sendResponse(res, dataWithPagination, "Successfully fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async createCategory(req: any, res: express.Response) {
    const { title, language = mes.lang } = req.body;
    try {
      const { _id: id } = req.user_data;
      const query = { title: title.trim() };
      const projection = { __v: 0 };
      const options = { lean: true };
      const fetch_data: any = await DAO.getSingleData(
        Models.Category,
        query,
        projection,
        options,
      );
      if (fetch_data) {
        throw await handleCustomError(mes.categoryAlreadyAvailable, language);
      }
      let file: any = null;
      if (req.files && req.files.icon) {
        file = await uploadToS3(req.files?.icon, `category/icon`);
      }
      const newCategory = await Models.Category.create({
        title,
        icon: file,
        createdBy: id,
      });
      sendResponse(res, newCategory, mes.createdSuccessfully);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async allCategory(req: any, res: express.Response) {
    try {
      let query = {};
      let projection = { __v: 0 };
      let options = { lean: true, sort: { title: 1 } };

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

  static async updateCategory(req: any, res: express.Response) {
    try {
      const { id, title, language = mes.lang } = req.body;
      if (!id) {
        throw await handleCustomError(mes.categoryReq, language);
      }
      if (!title) {
        throw await handleCustomError(mes.titleReq, language);
      }
      const query = { _id: id };
      const projection = { __v: 0 };
      const options = { lean: true };

      const fetch_data: any = await DAO.getData(
        Models.Category,
        query,
        projection,
        options,
      );

      if (!fetch_data.length) {
        throw await handleCustomError(mes.dataNotExist, language);
      }
      const data: any = {
        title,
      };
      if (req.files && req.files?.icon) {
        data.icon = await uploadToS3(req.files?.icon, "/category/icon");
      }

      const response = await DAO.findAndUpdate(
        Models.Category,
        { _id: id },
        data,
        options,
      );
      sendResponse(res, response, "Successfully");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async deleteCategory(req: any, res: express.Response) {
    try {
      const { id } = req.params;
      if (!id) {
        throw await handleCustomError(mes.categoryReq, mes.lang);
      }
      const query = { _id: id };
      const projection = { __v: 0 };
      const options = { lean: true };
      const fetch_data: any = await DAO.getSingleData(
        Models.Category,
        query,
        projection,
        options,
      );
      if (!fetch_data) {
        throw await handleCustomError(mes.dataNotExist, mes.lang);
      }
      const removeDoc: any = await DAO.removeData(Models.Category, query);
      sendResponse(res, null, mes.deleteSuccess);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberDetailWithProfile(req: any, res: express.Response) {
    try {
      const { id: memberId } = req.params;
      if (memberId) {
        throw await handleCustomError(mes.memberIdRequired, mes.lang);
      }
      const details = await adminHandleMemberDetailWithProfile(
        Models.Member,
        memberId,
      );
      sendResponse(res, details, "Fetched successfully");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async clientList(req: any, res: express.Response) {
    try {
      const { type, offset, limit } = helpers.customBodyParser(req.body);
      let query: any = {};

      if (type) query.adminApproval = type;
      const projection = {
        __v: 0,
        // password: 0,
        otp: 0,
        resetToken: 0,
        resetTokenExpiry: 0,
      };
      const options = { lean: true };
      const list: any = await DAO.getData(
        Models.Users,
        query,
        projection,
        options,
      );
      const dataWithPagination = helpers.dataWithPaginationForQuery(
        list,
        offset,
        limit,
      );
      sendResponse(res, dataWithPagination, "Successfully fetch");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async userCount(req: any, res: express.Response) {
    try {
      const lastWeekDate = new Date();
      lastWeekDate.setDate(lastWeekDate.getDate() - 7);

      const count = await Models.Admin.aggregate([
        {
          $lookup: {
            from: "members",
            pipeline: [],
            as: "allMembers",
          },
        },
        {
          $lookup: {
            from: "users",
            pipeline: [],
            as: "usersArray",
          },
        },
        {
          $addFields: {
            freeMembers: {
              $filter: {
                input: "$allMembers",
                as: "m",
                cond: { $eq: ["$$m.membership", "Free"] },
              },
            },
            basicMembers: {
              $filter: {
                input: "$allMembers",
                as: "m",
                cond: { $eq: ["$$m.membership", "Basic"] },
              },
            },
            premiumMembers: {
              $filter: {
                input: "$allMembers",
                as: "m",
                cond: { $eq: ["$$m.membership", "Premium"] },
              },
            },
            freeLastWeek: {
              $filter: {
                input: "$allMembers",
                as: "m",
                cond: {
                  $and: [
                    { $eq: ["$$m.membership", "Free"] },
                    { $gte: ["$$m.createdAt", lastWeekDate] },
                  ],
                },
              },
            },
            basicLastWeek: {
              $filter: {
                input: "$allMembers",
                as: "m",
                cond: {
                  $and: [
                    { $eq: ["$$m.membership", "Basic"] },
                    { $gte: ["$$m.createdAt", lastWeekDate] },
                  ],
                },
              },
            },
            premiumLastWeek: {
              $filter: {
                input: "$allMembers",
                as: "m",
                cond: {
                  $and: [
                    { $eq: ["$$m.membership", "Premium"] },
                    { $gte: ["$$m.createdAt", lastWeekDate] },
                  ],
                },
              },
            },

            clientsLastWeek: {
              $filter: {
                input: "$usersArray",
                as: "u",
                cond: { $gte: ["$$u.createdAt", lastWeekDate] },
              },
            },
          },
        },

        {
          $lookup: {
            from: "notifications",
            pipeline: [{ $match: { isRead: false } }],
            as: "unreadNotifications",
          },
        },

        {
          $project: {
            freeCount: { $size: "$freeMembers" },
            basicCount: { $size: "$basicMembers" },
            premiumCount: { $size: "$premiumMembers" },
            clientCount: { $size: "$usersArray" },

            freeThisWeek: { $size: "$freeLastWeek" },
            basicThisWeek: { $size: "$basicLastWeek" },
            premiumThisWeek: { $size: "$premiumLastWeek" },
            clientThisWeek: { $size: "$clientsLastWeek" },
            unreadNotificationCount: { $size: "$unreadNotifications" },
          },
        },
      ]);

      sendResponse(res, count[0], "success");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async handleClientApproval(req: any, res: express.Response) {
    const { id, type, language = mes.lang } = req.body;

    let query = { _id: id };
    let projection = { __v: 0 };
    let options = { lean: true };
    if (!id) {
      throw await handleCustomError(mes.clientIdRequired, language);
    }

    if (!["accepted", "rejected"].includes(type)) {
      throw await handleCustomError("Invalid type", language);
    }

    try {
      const client: any = await DAO.getSingleData(
        Models.Users,
        query,
        projection,
        options,
      );

      if (!client) {
        throw await handleCustomError(mes.clientNotExist, language);
      }

      const updatedClient: any = await DAO.findAndUpdate(
        Models.Users,
        { _id: client._id },
        { adminApproval: type },
        { new: true },
      );

      if (!updatedClient) {
        throw await handleCustomError(mes.updateFail, language);
      }

      await emailServices.adminActionInClientRegistration({
        ...client,
        type,
      });

      sendResponse(res, updatedClient, mes.updateDone);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async handleMemberProfileApproval(req: any, res: express.Response) {
    try {
      const { id, type, language = mes.lang } = req.body;
      const query = { _id: id };
      const projection = { __v: 0 };
      const options = { lean: true };
      const fetch_data: any = await DAO.getSingleData(
        Models.Profile,
        query,
        projection,
        options,
      );
      if (!fetch_data) {
        throw await handleCustomError("Profile not found", language);
      }
      const updatePayload = { isApproval: type };
      let updatedProfile: any;

      if (type === mes.accepted) {
        updatedProfile = await DAO.findAndUpdate(
          Models.Profile,
          { _id: fetch_data._id },
          updatePayload,
          { new: true },
        );
      } else if (type === mes.rejected) {
        updatedProfile = await DAO.findAndUpdate(
          Models.Profile,
          { _id: fetch_data._id },
          updatePayload,
          { new: true },
        );
      }
      sendResponse(res, updatedProfile, "Successfully update");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async createBlogs(req: any, res: express.Response) {
    try {
      let file: string = null;
      if (req.files && req.files?.image) {
        file = await uploadToS3(req.files?.image, "blogs");
      }
      let data = await adminServices.createBlog(req.body, file || null);

      sendResponse(res, data, mes.createBlog);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async updateBlogs(req: any, res: express.Response) {
    try {
      let file: string = null;
      if (req.files && req.files?.image) {
        file = await uploadToS3(req.files?.image, "blogs");
      }
      let data = await adminServices.updateBlog(req.body, file);

      sendResponse(res, data, mes.updateBlog);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async deleteBlogs(req: any, res: express.Response) {
    try {
      const { id } = req.params;
      const query = { _id: id };
      const projection = { __v: 0 };
      const options = { lean: true };
      const fetch_data: any = await DAO.getSingleData(
        Models.Blogs,
        query,
        projection,
        options,
      );
      if (!fetch_data) {
        throw await handleCustomError(mes.dataNotExist, mes.lang);
      }
      const removeDoc: any = await DAO.removeData(Models.Blogs, query);
      sendResponse(res, null, mes.deleteBlog);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getAllBlogs(req: any, res: express.Response) {
    try {
      let query: any = {};
      const projection = { __v: 0 };
      const options = {
        lean: true,
        populate: {
          path: "categoryId",
          select: "title",
        },
      };
      const allBlogs = await DAO.getData(
        Models.Blogs,
        query,
        projection,
        options,
      );
      sendResponse(res, allBlogs, mes.fetchAllBlog);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getNotifications(req: any, res: express.Response) {
    try {
      const { limit, offset } = helpers.customBodyParser(req.query);
      const response = await adminServices.fetchNotifications(limit, offset);
      sendResponse(res, response, "Success");
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async markNotificationRead(req: any, res: express.Response) {
    try {
      const { id } = req.body;
      const response = await adminServices.markRead(id);
      sendResponse(res, response, mes.markAsRead);
    } catch (err) {
      handleCatch(res, err);
    }
  }

  static async createSkill(req: any, res: express.Response) {
    try {
      const { title, categoryId, language = mes.lang } = req.body;
      const { _id: id } = req.user_data;
      if (!title || title.trim() === "") {
        throw await handleCustomError(mes.skillTitleReq, language);
      }
      const query = { title };
      const projection = { __v: 0 };
      const options = { lean: true };
      const existingSkill: any = await DAO.getSingleData(
        Models.Skill,
        query,
        projection,
        options,
      );

      if (existingSkill) {
        throw await handleCustomError(mes.skillAlreadyExist, language);
      }
      const newSkill = await Models.Skill.create({
        title,
        categoryId,
        createdBy: id,
      });
      sendResponse(res, newSkill, mes.skillCreated);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async deleteSkill(req: any, res: express.Response) {
    try {
      const { id: skillId } = req.params;
      const query = { _id: skillId };
      const projection = { __v: 0 };
      const options = { lean: true };

      const fetch_data: any = await DAO.getSingleData(
        Models.Skill,
        query,
        projection,
        options,
      );
      if (!fetch_data) {
        throw await handleCustomError(mes.dataNotExist, mes.lang);
      }
      const removeDoc: any = await DAO.removeData(Models.Skill, query);
      sendResponse(res, null, mes.deleteSuccess);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberProfileListWithReview(req: any, res: express.Response) {
    try {
      const { type, country, categoryId } = req.body;

      const ratingFilter = type ? { status: type } : {};
      const list = await adminMemberProfileListWithReview(
        Models.Profile,
        type,
        country,
        categoryId,
      );
      sendResponse(res, list, mes.memberWithRating);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async adminActionInReview(req: any, res: express.Response) {
    try {
      const { id, type, language = mes.lang } = req.body;
      const query = { _id: id };
      if (!id) {
        throw await handleCustomError(mes.ratingIdreq, language);
      }
      if (!["published", "unpublished"].includes(type)) {
        throw await handleCustomError(mes.invalidType, language);
      }

      const fetch_data: any = await DAO.getSingleData(
        Models.ClientRating,
        query,
        { __v: 0 },
        { lean: true },
      );
      if (!fetch_data) {
        throw await handleCustomError(mes.ratingNotExist, language);
      }
      console.log(fetch_data);
      const update_data = { status: type };
      const edit_rating = await DAO.findAndUpdate(
        Models.ClientRating,
        { _id: fetch_data?._id },
        update_data,
        { new: true },
      );
      console.log(edit_rating);
      sendResponse(res, edit_rating, mes.updateDone);
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async clientListWithJobCount(req: any, res: express.Response) {
    const {
      limit,
      offset,
      type,
      language = mes.lang,
    } = helpers.customBodyParser(req.body);
    try {
      if (!type) {
        throw await handleCustomError(mes.typeReq, language);
      }

      if (!Object.keys(JOB_TYPE).includes(type)) {
        throw await handleCustomError(mes.invalidType, language);
      }
      const list = await Models.Users.aggregate([
        {
          $match: { adminApproval: "accepted" },
        },
        // {
        //   $lookup: {
        //     from: "clientjobs",
        //     localField: "_id",
        //     foreignField: "postedBy",
        //     as: "jobData",
        //   },
        // },
        {
          $lookup: {
            from: "clientjobs",
            let: { clientId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$postedBy", "$$clientId"] },
                      { $eq: ["$isDeleted", false] },
                      { $eq: ["$type", type] },
                    ],
                  },
                },
              },
            ],
            as: "jobData",
          },
        },
        {
          $project: {
            _id: 1,
            fullName: 1,
            email: 1,
            country: 1,
            category: 1,
            // jobData:1,
            jobCount: { $size: "$jobData" },
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
        list,
        offset,
        limit,
      );
      sendResponse(res, dataWithPagination, "Successfully fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async jobListByClientId(req: any, res: express.Response) {
    try {
      const {
        id: clientId,
        type,
        offset,
        limit,
        language = mes.lang,
      } = helpers.customBodyParser(req.body);

      if (!clientId) {
        throw await handleCustomError(mes.clientIdRequired, language);
      }
      if (!Object.keys(JOB_TYPE).includes(type)) {
        throw await handleCustomError(mes.invalidType, language);
      }
      const list = await Models.ClientJob.aggregate([
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
          $project: {
            __v: 0,
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
        list,
        offset,
        limit,
      );
      sendResponse(res, dataWithPagination, "Successfully fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getSkillsByCategory(req: any, res: express.Response) {
    try {
      const { categoryId, language = mes.lang } = req.body;
      if (!categoryId) {
        throw await handleCustomError(mes.categoryReq, language);
      }
      const query = { categoryId };
      const projection = { __v: 0 };
      const options = { lean: true, sort: { title: 1 } };
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

  // static async adminActionInProfileChangeRequest(
  //   req: any,
  //   res: express.Response
  // ) {
  //   try {
  //     const { id: profileId, type, language = "ENGLISH" } = req.body;
  //     const adminId = req.user_data?._id;
  //     const MEMBER_FIELDS = helpers.MEMBER_FIELDS;
  //     const PROFILE_FIELDS = helpers.PROFILE_FIELDS;
  //     if (!["approved", "rejected"].includes(type)) {
  //       throw await handleCustomError("Invalid action type", language);
  //     }

  //     const profile: any = await Models.Profile.findById(profileId);
  //     if (!profile) {
  //       throw await handleCustomError("Profile not found", language);
  //     }

  //     if (profile.status !== "pending") {
  //       throw await handleCustomError(
  //         "This change request is already processed",
  //         language
  //       );
  //     }

  //     const member: any = await Models.Member.findById(profile.memberId);
  //     if (!member) {
  //       throw await handleCustomError("Member not found", language);
  //     }

  //     if (type === "rejected") {
  //       profile.changes = {};
  //       profile.status = "rejected";
  //       profile.reviewedBy = adminId;
  //       await profile.save();

  //       return sendResponse(res, null, "Change request rejected");
  //     }

  //     const memberUpdates: any = {};
  //     const profileUpdates: any = {};

  //     Object.entries(profile.changes || {}).forEach(([key, value]) => {
  //       if (MEMBER_FIELDS.includes(key)) {
  //         memberUpdates[key] = value;
  //       } else if (PROFILE_FIELDS.includes(key)) {
  //         profileUpdates[key] = value;
  //       }
  //     });

  //     if (Object.keys(memberUpdates).length) {
  //       Object.assign(member, memberUpdates);
  //       // member.status = "approved";
  //       // member.changes = null;
  //       await member.save();
  //     }
  //     if (Object.keys(profileUpdates).length) {
  //       Object.assign(profile, profileUpdates);
  //     }

  //     profile.changes = {};
  //     profile.status = "approved";
  //     // profile.reviewedBy = adminId;
  //     await profile.save();

  //     sendResponse(
  //       res,
  //       // {
  //       //   memberUpdated: Object.keys(memberUpdates),
  //       //   profileUpdated: Object.keys(profileUpdates),
  //       // },
  //       null,
  //       "Change request approved successfully"
  //     );
  //   } catch (error) {
  //     handleCatch(res, error);
  //   }
  // }

  static async adminActionInProfileChangeRequest(
    req: any,
    res: express.Response,
  ) {
    try {
      const { id: profileId, type, language = mes.lang } = req.body;
      const adminId = req.user_data?._id;
      if (!profileId) {
        throw await handleCustomError(mes.profileIdReq, language);
      }

      const MEMBER_FIELDS = helpers.MEMBER_FIELDS;
      const PROFILE_FIELDS = helpers.PROFILE_FIELDS;

      if (!["approved", "rejected"].includes(type)) {
        throw await handleCustomError(mes.invalidType, language);
      }

      const profile: any = await Models.Profile.findById(profileId);
      if (!profile) {
        throw await handleCustomError(mes.profileNotFound, language);
      }

      if (profile.status !== mes.pending) {
        throw await handleCustomError(
          "This change request is already processed",
          language,
        );
      }

      const member: any = await Models.Member.findById(profile.memberId);
      if (!member) {
        throw await handleCustomError("Member not found", language);
      }

      if (type === "rejected") {
        profile.changes = {};
        profile.status = "rejected";
        profile.reviewedBy = adminId;
        await profile.save();
        return sendResponse(res, null, "Change request rejected");
      }

      const changes = profile.changes || {};

      // --- MEMBER UPDATES ---
      if (Object.keys(changes).length) {
        if (changes.skillIds) {
          member.skillIds = changes.skillIds.map(
            (id: string) => new Types.ObjectId(id),
          );
        }
        if (changes.categoryId) {
          member.categoryId = new Types.ObjectId(changes.categoryId);
        }

        MEMBER_FIELDS.forEach((key) => {
          if (
            changes[key] !== undefined &&
            !["skillIds", "categoryId"].includes(key)
          ) {
            member[key] = changes[key];
          }
        });

        await member.save();
      }

      // --- PROFILE UPDATES ---
      if (Object.keys(changes).length) {
        if (changes.skillIds) {
          profile.skillIds = changes.skillIds.map(
            (id: string) => new Types.ObjectId(id),
          );
        }
        if (changes.categoryId) {
          profile.categoryId = new Types.ObjectId(changes.categoryId);
        }

        if (changes.socialLinks) {
          profile.socialLinks = {
            ...(profile.socialLinks?.toObject?.() || {}),
            ...changes.socialLinks,
          };
          profile.markModified("socialLinks");
        }

        PROFILE_FIELDS.forEach((key) => {
          if (
            changes[key] !== undefined &&
            !["skillIds", "categoryId", "socialLinks"].includes(key)
          ) {
            profile[key] = changes[key];
          }
        });
      }

      // Final cleanup
      profile.changes = {};
      profile.status = "approved";
      profile.reviewedBy = adminId;

      await profile.save();

      sendResponse(res, null, "Change request approved successfully");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async memberProfileChangeList(req: any, res: express.Response) {
    try {
      const { offset, limit } = helpers.customBodyParser(req.body);

      const list: any = await Models.Profile.aggregate([
        {
          $match: { changes: { $exists: true } },
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
          $unwind: { path: "$member", preserveNullAndEmptyArrays: true },
        },
        // Old Category & Skills
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "oldCategoryData",
          },
        },
        {
          $lookup: {
            from: "skills",
            localField: "skillIds",
            foreignField: "_id",
            as: "oldSkillsData",
          },
        },
        // New Category & Skills (from changes)
        {
          $lookup: {
            from: "categories",
            localField: "changes.categoryId",
            foreignField: "_id",
            as: "newCategoryData",
          },
        },
        {
          $lookup: {
            from: "skills",
            localField: "changes.skillIds",
            foreignField: "_id",
            as: "newSkillsData",
          },
        },
        {
          $project: {
            profileId: "$_id",
            memberId: 1,
            fullName: "$member.fullName",
            phoneNumber: "$member.phoneNumber",
            whatsappNumber: "$member.whatsappNumber",
            workDescription: 1,
            overview: 1,
            businessTradingName: 1,
            category: { $arrayElemAt: ["$oldCategoryData.title", 0] },
            skills: "$oldSkillsData.title",
            socialLinks: 1,
            newData: {
              fullName: { $ifNull: ["$changes.fullName", "$member.fullName"] },
              phoneNumber: {
                $ifNull: ["$changes.phoneNumber", "$member.phoneNumber"],
              },
              whatsappNumber: {
                $ifNull: ["$changes.whatsappNumber", "$member.whatsappNumber"],
              },
              businessTradingName: {
                $ifNull: [
                  "$changes.businessTradingName",
                  "$businessTradingName",
                ],
              },
              workDescription: {
                $ifNull: ["$changes.workDescription", "$workDescription"],
              },
              overview: { $ifNull: ["$changes.overview", "$overview"] },
              category: { $arrayElemAt: ["$newCategoryData.title", 0] },
              skills: "$newSkillsData.title",
              socialLinks: "$changes.socialLinks",
            },
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
        list,
        offset,
        limit,
      );
      sendResponse(
        res,
        dataWithPagination,
        "Successfully fetched profile changes",
      );
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async createAdvisory(req: any, res: express.Response) {
    try {
      const {
        title,
        description,
        categoryId,
        type,
        language = mes.lang,
      } = req.body;
      if (!type) {
        throw await handleCustomError(mes.typeReq, language);
      }

      const query = { title: title };
      const projection = { __v: 0 };
      const options = { lean: true };
      const fetch_data: any = await DAO.getSingleData(
        Models.Advisory,
        query,
        projection,
        options,
      );
      if (fetch_data) {
        throw await handleCustomError(mes.advisoryAlreadyExist, language);
      }
      let file: any = null;
      if (req.files && req.files.image) {
        file = await uploadToS3(req.files?.image, `advisory/image`);
      }
      const newAdvisory = await Models.Advisory.create({
        title,
        description,
        image: file,
        type,
        categoryId: new Types.ObjectId(categoryId),
      });
      sendResponse(res, newAdvisory, "Successfully created");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async editAdvisory(req: any, res: express.Response) {
    try {
      const {
        id,
        title,
        description,
        categoryId,
        type,
        language = mes.lang,
      } = req.body;

      if (!id) {
        throw await handleCustomError("Advisory ID is required", language);
      }

      const update: any = {};
      if (title) update.title = title;
      if (description) update.description = description;
      if (categoryId) update.categoryId = new Types.ObjectId(categoryId);
      if (type) update.type = type;

      if (req.files && req.files.image) {
        const file = await uploadToS3(req.files.image, `advisory/image`);
        update.image = file;
      }
      const options = { new: true, lean: true };

      if (title) {
        const duplicate = await DAO.getSingleData(
          Models.Advisory,
          { title, _id: { $ne: new Types.ObjectId(id) } },
          { __v: 0 },
          { lean: true },
        );
        if (duplicate) {
          throw await handleCustomError(
            "Another advisory with this title already exists",
            language,
          );
        }
      }

      const query = { _id: new Types.ObjectId(id) };
      const updatedAdvisory = await DAO.findAndUpdate(
        Models.Advisory,
        query,
        update,
        options,
      );

      if (!updatedAdvisory) {
        throw await handleCustomError("Advisory not found", language);
      }

      sendResponse(res, updatedAdvisory, "Successfully updated advisory");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async deleteAdvisory(req: any, res: express.Response) {
    try {
      const { id } = req.params;

      if (!id) {
        throw await handleCustomError("Advisory ID is required", "ENGLISH");
      }

      const query = { _id: new Types.ObjectId(id) };

      const existingAdvisory: any = await DAO.getSingleData(
        Models.Advisory,
        query,
        { __v: 0 },
        { lean: true },
      );

      if (!existingAdvisory) {
        throw await handleCustomError("Advisory not found", "ENGLISH");
      }

      const removeDoc: any = await DAO.removeData(Models.Advisory, query);

      sendResponse(res, removeDoc, "Successfully deleted advisory");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async advisoryList(req: any, res: express.Response) {
    try {
      const {
        // id: categoryId,
        offset,
        limit,
        type,
        language = "ENGLISH",
      } = helpers.customBodyParser(req.body);
      // if (!categoryId) {
      //   throw await handleCustomError("Category is required", language);
      // }
      const listPromise = await adminHandleAdvisoryList(
        Models.Advisory,
        // categoryId,
        type,
        offset,
        limit,
      );
      console.log("object", listPromise[0]);
      const dataWithPagination = helpers.dataWithPagination(
        listPromise,
        offset,
        limit,
      );

      // const categoryPromise = await DAO.getSingleData(
      //   Models.Category,
      //   { _id: categoryId },
      //   { title: 1, icon: 1 },
      //   { lean: true }
      // );

      // const [list, category]: any = await Promise.all([
      //   dataWithPagination,
      //   categoryPromise,
      // ]);

      // const data: any = {
      //   _id: category._id,
      //   title: category.title,
      //   icon: category.icon,
      //   advisories: list,
      // };
      sendResponse(res, dataWithPagination, "Data fetched successfully.");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async deleteOneJobByAdmin(req: any, res: express.Response) {
    try {
      const { jobId } = req.params;
      const projection = { __v: 0 };
      const options = { lean: true };
      const query = { _id: jobId };
      if (!jobId) {
        throw await handleCustomError("Job id is required", "ENGLISH");
      }
      const fetch_job: any = await DAO.getSingleData(
        Models.ClientJob,
        query,
        projection,
        options,
      );
      if (!fetch_job) {
        throw await handleCustomError("Job does not exist", "ENGLISH");
      }
      if (fetch_job.isDeleted) {
        throw await handleCustomError("Job already deleted", "ENGLISH");
      }
      const update_data = {
        isDeleted: true,
        deletedBy: "Admin",
        deletedAt: new Date(),
      };
      const update_job = await DAO.findAndUpdate(
        Models.ClientJob,
        query,
        update_data,
        { new: true },
      );
      sendResponse(res, update_job, "Job deleted successfully");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async deleteAllJobsOfClientByAdmin(req: any, res: express.Response) {
    try {
      // const { _id: clientId,language="ENGLISH" } = req.body;
      const { clientId } = req.params;
      const { type } = req.body;
      if (!clientId) {
        throw await handleCustomError("CLIENT_ID_IS_REQUIRED", "ENGLISH");
      }
      if (!type || !Object.values(JOB_TYPE).includes(type)) {
        throw await handleCustomError("INVALID_TYPE_PROVIDED", "ENGLISH");
      }
      const query = { postedBy: clientId, isDeleted: false, type: type };
      const update_data = {
        isDeleted: true,
        deletedBy: "Admin",
        deletedAt: new Date(),
      };
      const result = await Models.ClientJob.updateMany(query, {
        $set: update_data,
      });
      sendResponse(res, result, "All jobs deleted successfully");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async userByCountry(req: any, res: express.Response) {
    try {
      const user = await Models.Admin.aggregate([
        {
          $match: {
            _id: req.user_data?._id,
          },
        },
        {
          $lookup: {
            from: "members",
            pipeline: [
              {
                $match: {
                  country: { $ne: null },
                },
              },
            ],
            as: "memberData",
          },
        },
        {
          $lookup: {
            from: "users",
            pipeline: [
              {
                $match: {
                  country: { $ne: null },
                },
              },
            ],
            as: "clientData",
          },
        },
        {
          $addFields: {
            allUsers: {
              $concatArrays: ["$memberData", "$clientData"],
            },
          },
        },
        {
          $unwind: "$allUsers",
        },
        {
          $group: {
            _id: "$allUsers.country",
            totalUsers: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            // allUsers:1,
            // userCount: { $size: "$allUsers" },
            country: "$_id",
            totalUsers: 1,
          },
        },
      ]);
      console.log("user>>>>>>>", user);
      sendResponse(res, user, "Success");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getMemberAndRevenue(req: any, res: express.Response) {
    try {
      const data = await Models.Payment.aggregate([
        {
          $match: { paymentStatus: "success" },
        },
        {
          $addFields: {
            month: {
              $dateToString: { format: "%Y-%m", date: "$paidAt" },
            },
            week: {
              $dateToString: { format: "%Y-W%V", date: "$paidAt" },
            },
          },
        },
        {
          $facet: {
            monthlyDistribution: [
              {
                $group: {
                  _id: "$month",
                  revenue: { $sum: "$amount" },
                  basic: {
                    $sum: { $cond: [{ $eq: ["$plan", "Basic"] }, 1, 0] },
                  },
                  premium: {
                    $sum: { $cond: [{ $eq: ["$plan", "Premium"] }, 1, 0] },
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  month: "$_id",
                  Basic: 1,
                  Premium: 1,
                  revenue: 1,
                },
              },
              { $sort: { month: 1 } },
            ],
            weeklyRevenue: [
              {
                $group: {
                  _id: "$week",
                  revenue: { $sum: "$amount" },
                },
              },
              {
                $project: {
                  _id: 0,
                  week: "$_id",
                  revenue: 1,
                },
              },
              { $sort: { week: 1 } },
            ],
          },
        },
      ]);

      sendResponse(res, data[0], "Dashboard data fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  // static async getDashboardStats(req: any, res: express.Response) {
  //   try {
  //     const data = await Models.Payment.aggregate([
  //       {
  //         $match: { paymentStatus: "success" },
  //       },
  //       {
  //         $lookup: {
  //           from: "plans",
  //           localField: "planId",
  //           foreignField: "_id",
  //           as: "planData",
  //         },
  //       },
  //       { $unwind: "$planData" },
  //       {
  //         $addFields: {
  //           month: { $dateToString: { format: "%b", date: "$paidAt" } }, // Jan
  //           monthKey: { $dateToString: { format: "%Y-%m", date: "$paidAt" } },
  //           weekDay: { $dayOfWeek: "$paidAt" }, // 1 (Sun) - 7 (Sat)
  //         },
  //       },

  //       {
  //         $facet: {
  //           /* =========================
  //            MONTHLY MEMBER DISTRIBUTION
  //         ========================== */
  //           memberDistribution: [
  //             {
  //               $group: {
  //                 _id: "$monthKey",
  //                 month: { $first: "$month" },
  //                 basic: {
  //                   $sum: {
  //                     $cond: [{ $eq: ["$planData.name", "Basic"] }, 1, 0],
  //                   },
  //                 },
  //                 premium: {
  //                   $sum: { $cond: [{ $eq: ["$planData.name", "Premium"] }, 1, 0] },
  //                 },
  //               },
  //             },
  //             { $sort: { _id: 1 } },
  //           ],
  //           monthlyRevenue: [
  //             {
  //               $group: {
  //                 _id: "$monthKey",
  //                 month: { $first: "$month" },
  //                 revenue: { $sum: "$amount" },
  //               },
  //             },
  //             { $sort: { _id: 1 } },
  //           ],
  //           weeklyRevenue: [
  //             {
  //               $group: {
  //                 _id: "$weekDay",
  //                 revenue: { $sum: "$amount" },
  //               },
  //             },
  //             { $sort: { _id: 1 } },
  //           ],
  //         },
  //       },
  //     ]);

  //     const result = data[0];

  //     //   // WEEK DAY MAPPING
  //     //   const weekMap = {
  //     //     1: "Sun",
  //     //     2: "Mon",
  //     //     3: "Tue",
  //     //     4: "Wed",
  //     //     5: "Thu",
  //     //     6: "Fri",
  //     //     7: "Sat",
  //     //   };

  //     //   /* =========================
  //     //    FORMAT FOR FRONTEND CHARTS
  //     // ========================== */

  //     //   const weeklyRevenue = {
  //     //     labels: result.weeklyRevenue.map((w) => weekMap[w._id]),
  //     //     data: result.weeklyRevenue.map((w) => w.revenue),
  //     //   };

  //     //   const monthlyRevenue = {
  //     //     labels: result.monthlyRevenue.map((m) => m.month),
  //     //     data: result.monthlyRevenue.map((m) => m.revenue),
  //     //   };

  //     //   const memberDistribution = {
  //     //     labels: result.memberDistribution.map((m) => m.month),
  //     //     basic: result.memberDistribution.map((m) => m.Basic),
  //     //     premium: result.memberDistribution.map((m) => m.Premium),
  //     //   };

  //     sendResponse(
  //       res,
  //       data[0],
  //       // {
  //       //   weeklyRevenue,
  //       //   monthlyRevenue,
  //       //   memberDistribution,
  //       // },
  //       "Dashboard stats fetched",
  //     );
  //   } catch (error) {
  //     handleCatch(res, error);
  //   }
  // }

  static async getDashboardStats1(req: any, res: express.Response) {
    try {
      const data = await Models.Payment.aggregate([
        {
          $match: { paymentStatus: "success" },
        },

        {
          $lookup: {
            from: "plans",
            localField: "planId",
            foreignField: "_id",
            as: "planData",
          },
        },

        { $unwind: "$planData" },

        {
          $addFields: {
            month: { $dateToString: { format: "%b", date: "$paidAt" } },
            monthKey: { $dateToString: { format: "%Y-%m", date: "$paidAt" } },
            weekDay: { $dayOfWeek: "$paidAt" },
          },
        },

        {
          $facet: {
            // memberDistribution: [
            //   {
            //     $group: {
            //       _id: {
            //         member: "$memberId",
            //         month: "$monthKey",
            //       },
            //       month: { $first: "$month" },
            //       plan: { $first: "$planData.name" },
            //     },
            //   },

            //   {
            //     $group: {
            //       _id: "$_id.month",
            //       month: { $first: "$month" },

            //       basic: {
            //         $sum: {
            //           $cond: [{ $eq: ["$plan", "Basic"] }, 1, 0],
            //         },
            //       },

            //       premium: {
            //         $sum: {
            //           $cond: [{ $eq: ["$plan", "Premium"] }, 1, 0],
            //         },
            //       },
            //     },
            //   },

            //   { $sort: { _id: 1 } },
            // ],
            memberDistribution: [
              {
                $sort: { paidAt: 1 },
              },

              {
                $group: {
                  _id: {
                    member: "$memberId",
                    month: "$monthKey",
                  },
                  latestPlan: { $last: "$planData.name" },
                  month: { $last: "$month" },
                },
              },

              {
                $group: {
                  _id: "$_id.month",
                  month: { $first: "$month" },

                  basic: {
                    $sum: {
                      $cond: [{ $eq: ["$latestPlan", "Basic"] }, 1, 0],
                    },
                  },

                  premium: {
                    $sum: {
                      $cond: [{ $eq: ["$latestPlan", "Premium"] }, 1, 0],
                    },
                  },
                },
              },

              {
                $sort: { _id: 1 },
              },
            ],
            monthlyRevenue: [
              {
                $group: {
                  _id: "$monthKey",
                  month: { $first: "$month" },
                  revenue: { $sum: "$amount" },
                },
              },
              { $sort: { _id: 1 } },
            ],
            weeklyRevenue: [
              {
                $group: {
                  _id: "$weekDay",
                  revenue: { $sum: "$amount" },
                },
              },

              { $sort: { _id: 1 } },
            ],
            totalRevenue: [
              {
                $group: {
                  _id: null,
                  total: { $sum: "$amount" },
                },
              },
            ],
          },
        },
      ]);
      const result = data[0] || {};

      const totalRevenue = result?.totalRevenue?.[0]?.total || 0;

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const weeklyRevenue = days.map((day, index) => {
        const found = result.weeklyRevenue?.find(
          (d: any) => d._id === index + 1,
        );
        return {
          day,
          revenue: found?.revenue || 0,
        };
      });

      const monthlyRevenue =
        result?.monthlyRevenue?.map((m: any) => ({
          month: m.month,
          revenue: m.revenue,
        })) || [];

      const currentWeekRevenue = weeklyRevenue.reduce(
        (sum, d) => sum + d.revenue,
        0,
      );

      result.totalRevenueCollected = totalRevenue;
      result.weeklyRevenue = weeklyRevenue;
      result.monthlyRevenue = monthlyRevenue;
      result.thisWeekRevenue = currentWeekRevenue;

      sendResponse(res, result, "Dashboard stats fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }
  static async getDashboardStats(req: any, res: express.Response) {
    const startOfWeek = moment().startOf("isoWeek").toDate();
    const endOfWeek = moment().endOf("isoWeek").toDate(); 
    try {
      const data = await Models.Payment.aggregate([
        {
          $match: { paymentStatus: "success" },
        },

        {
          $lookup: {
            from: "plans",
            localField: "planId",
            foreignField: "_id",
            as: "planData",
          },
        },

        { $unwind: "$planData" },

        {
          $addFields: {
            monthKey: { $dateToString: { format: "%Y-%m", date: "$paidAt" } },
            weekDay: { $dayOfWeek: "$paidAt" },
          },
        },

        {
          $facet: {
            memberDistribution: [
              { $sort: { paidAt: 1 } },

              {
                $group: {
                  _id: {
                    member: "$memberId",
                    month: "$monthKey",
                  },
                  latestPlan: { $last: "$planData.name" },
                },
              },

              {
                $group: {
                  _id: "$_id.month",

                  basic: {
                    $sum: {
                      $cond: [{ $eq: ["$latestPlan", "Basic"] }, 1, 0],
                    },
                  },

                  premium: {
                    $sum: {
                      $cond: [{ $eq: ["$latestPlan", "Premium"] }, 1, 0],
                    },
                  },
                },
              },

              {
                $project: {
                  _id: 0,
                  month: "$_id",
                  basic: 1,
                  premium: 1,
                },
              },

              { $sort: { month: 1 } },
            ],

            monthlyRevenue: [
              {
                $group: {
                  _id: "$monthKey",
                  revenue: { $sum: "$amount" },
                },
              },

              {
                $project: {
                  _id: 0,
                  month: "$_id",
                  revenue: 1,
                },
              },

              { $sort: { month: 1 } },
            ],

            // weeklyRevenue: [
            //   {
            //     $group: {
            //       _id: "$weekDay",
            //       revenue: { $sum: "$amount" },
            //     },
            //   },
            //   { $sort: { _id: 1 } },
            // ],
            weeklyRevenue: [
              {
                $match: {
                  paymentStatus: "success",
                  paidAt: { $gte: startOfWeek, $lte: endOfWeek }, 
                },
              },
              {
                $addFields: { weekDay: { $dayOfWeek: "$paidAt" } },
              },
              {
                $group: {
                  _id: "$weekDay",
                  revenue: { $sum: "$amount" },
                },
              },
              { $sort: { _id: 1 } },
            ],

            totalRevenue: [
              {
                $group: {
                  _id: null,
                  total: { $sum: "$amount" },
                },
              },
            ],
          },
        },
      ]);

      const result = data[0] || {};

      const totalRevenue = result?.totalRevenue?.[0]?.total || 0;

      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

      const weeklyRevenue = days.map((day, index) => {
        const found = result.weeklyRevenue?.find(
          (d: any) => d._id === index + 1,
        );
        return {
          day,
          revenue: found?.revenue || 0,
        };
      });

      const currentWeekRevenue = weeklyRevenue.reduce(
        (sum, d) => sum + d.revenue,
        0,
      );

      const response = {
        memberDistribution: result.memberDistribution || [],
        monthlyRevenue: result.monthlyRevenue || [],
        weeklyRevenue: weeklyRevenue,
        totalRevenueCollected: totalRevenue,
        thisWeekRevenue: currentWeekRevenue,
      };

      sendResponse(res, response, "Dashboard stats fetched");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async getContactUsList(req: any, res: express.Response) {
    try {
      const { limit, offset } = helpers.customBodyParser(req.body);
      const data = await adminServices.fetchContactUsList(limit, offset);
      const dataWithPagination = helpers.dataWithPagination(
        data,
        offset,
        limit,
      );
      sendResponse(
        res,
        dataWithPagination,
        "Contact requests fetched successfully",
      );
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async createPlan(req: any, res: express.Response) {
    try {
      const { name, price, durationInMonths, features } = req.body;

      const query = { name: new RegExp(`^${name}$`, "i") };
      const projection = { __v: 0 };
      const options = { lean: true };
      const existingPlan: any = await DAO.getSingleData(
        Models.Plan,
        query,
        projection,
        options,
      );
      if (existingPlan) {
        throw await handleCustomError("Plan Already Exist ", "ENGLISH");
      }
      const newPlan = await Models.Plan.create({
        name: name.toLowerCase(),
        price,
        durationInMonths,
        features,
      });
      sendResponse(res, newPlan, "Successfully created");
    } catch (error) {
      handleCatch(res, error);
    }
  }

  static async updatePlan(req: any, res: express.Response) {
    try {
      const { id, name, price, features, language = mes.lang } = req.body;
      const query = { _id: id };
      const projection = { __v: 0 };
      const options = { lean: true };
      const plan: any = await DAO.getSingleData(
        Models.Plan,
        query,
        projection,
        options,
      );
      if (!plan) {
        throw await handleCustomError("Data not found", language);
      }
      const data = {
        name,
        price,
        features,
      };
      const response = await DAO.findAndUpdate(
        Models.Plan,
        { _id: id },
        data,
        options,
      );
      sendResponse(res, response, "Successfully");
    } catch (error) {
      handleCatch(res, error);
    }
  }
}

export default adminController;

// static async getUsersByCountry(req: any, res: any) {
//   try {
//     const data = await Models.Admin.aggregate([
//       {
//         $lookup: {
//           from: "members",
//           pipeline: [
//             {
//               $match: {
//                 isDelete: false,
//                 adminApproval: "accepted",
//                 country: { $ne: null }
//               }
//             },
//             {
//               $project: {
//                 country: 1
//               }
//             }
//           ],
//           as: "members"
//         }
//       },
//       {
//         $lookup: {
//           from: "users",
//           pipeline: [
//             {
//               $match: {
//                 isDelete: false,
//                 adminApproval: "accepted",
//                 country: { $ne: null }
//               }
//             },
//             {
//               $project: {
//                 country: 1
//               }
//             }
//           ],
//           as: "clients"
//         }
//       },
//       {
//         $project: {
//           allUsers: {
//             $concatArrays: ["$members", "$clients"]
//           }
//         }
//       },
//       { $unwind: "$allUsers" },
//       {
//         $group: {
//           _id: "$allUsers.country",
//           totalUsers: { $sum: 1 }
//         }
//       },
//       {
//         $project: {
//           country: { $ifNull: ["$_id", "Other"] },
//           totalUsers: 1,
//           _id: 0
//         }
//       },
//       { $sort: { totalUsers: -1 } }
//     ]);

//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: "Country aggregation failed" });
//   }
// }
