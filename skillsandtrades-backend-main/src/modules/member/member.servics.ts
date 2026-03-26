import express from "express";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";
import { app_constant } from "../../config/index";
const member_scope = app_constant.scope.member;
import {
  handleCustomError,
  generate_token,
  helpers,
} from "../../middlewares/index";
import { sendOTP, welcomeMail } from "../../middlewares/email_services";
import path from "path";
import fs from "fs";
import { Types } from "mongoose";
import { uploadToS3 } from "../../middlewares/s3Client";
import moment from "moment";
import * as emailServices from "../../middlewares/email_services";
import MEMBER_MESSAGES from "../../config/message/member_message";
const mes = { ...MEMBER_MESSAGES };

class memberServices {
  static async saveSessionData(access_token: any, token_data: any) {
    try {
      let { _id: member_id, token_gen_at, expire_time } = token_data;
      let set_data = {
        type: "MEMBER",
        member_id: member_id,
        access_token: access_token,
        token_gen_at: token_gen_at,
        created_at: +new Date(),
        expire_time: expire_time,
      };
      let response = await DAO.saveData(Models.Sessions, set_data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async fetchMembertoken(token_data: any) {
    try {
      let access_token = await generate_token(token_data);
      let response = await this.saveSessionData(access_token, token_data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async fetchTotalCount(collection: any, query: any) {
    try {
      let response = await DAO.countData(collection, query);
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async generateMemberToken(_id: string) {
    try {
      let token_data = {
        _id: _id,
        scope: member_scope,
        collection: Models.Member,
        token_gen_at: +new Date(),
      };
      let response = await this.fetchMembertoken(token_data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async makeMemberResponse(data: any, language: string) {
    try {
      let { member_id, token_gen_at, access_token } = data;

      let query = { _id: member_id };
      let projection = { password: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Member,
        query,
        projection,
        options,
      );

      if (fetch_data.length) {
        fetch_data[0].access_token = access_token;
        fetch_data[0].token_gen_at = token_gen_at;

        return fetch_data[0];
      } else {
        throw await handleCustomError("UNAUTHORIZED", language);
      }
    } catch (err) {
      throw err;
    }
  }

  static async verifyMember(query: any) {
    try {
      let projection = { __v: 0 };
      let options = { lean: true };
      let response = await DAO.getData(
        Models.Member,
        query,
        projection,
        options,
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async createMember(req_data: any, file: any) {
    try {
      const {
        fullName,
        email,
        password,
        address,
        phoneNumber,
        businessTradingName,
        countryCode,
        categoryId,
        skillIds,
        state,
        country,
        locality,
        // membership,
        gender,
        longitude,
        latitude,

        language = mes.lang,
      } = req_data;
      let number = Math.floor(100000 + Math.random() * 900000);

      const projection = { __v: 0 };
      const options = { lean: true };
      const check: any = await DAO.getData(
        Models.Member,
        { email: email.toLowerCase() },
        projection,
        options,
      );
      if (check.length > 0) {
        throw await handleCustomError(mes.emailAlreadyExist, language);
      }

      const hashedPassword = await helpers.bcrypt_password(password);
      const data: any = {
        fullName: fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        address,
        phoneNumber,
        otp: number,
        state,
        country,
        locality,
        businessTradingName,
        countryCode,
        categoryId,
        skillIds,
        latitude,
        longitude,

        gender,
      };
      if (file) {
        data.image = file;
      }

      const response = await DAO.saveData(Models.Member, data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async editMember(id: any, req_data: any, file: any) {
    try {
      const {
        fullName,
        phoneNumber,
        whatsappNumber,
        telephoneNumber,
        language = "ENGLISH",
      } = req_data;
      console.log(req_data);
      const projection = { __v: 0 };
      const options = { lean: true };
      const check: any = await DAO.getSingleData(
        Models.Member,
        { _id: id },
        projection,
        options,
      );
      if (!check) {
        throw await handleCustomError("NO_DATA_FOUND", language);
      }

      const data: any = {
        fullName: fullName,
        phoneNumber,
        whatsappNumber,
        telephoneNumber,
      };

      if (file) {
        data.image = file;
      }

      // if (socialLinks) {
      //   if (check.membership === "premium") {
      //     const allowedKeys = [
      //       "facebook",
      //       "instagram",
      //       "linkedin",
      //       "tiktok",
      //       "twitter",
      //       "website",
      //     ];
      //     data.socialLinks = {
      //       ...check.socialLinks,
      //       ...socialLinks,
      //     };

      //     allowedKeys.forEach((key) => {
      //       if (socialLinks[key] === undefined) {
      //         data.socialLinks[key] = check?.socialLinks[key];
      //       }
      //     });
      //   } else {
      //     throw await handleCustomError(
      //       "Only Premium members can update social links",
      //       language
      //     );
      //   }
      // }
      const response = await DAO.findAndUpdate(
        Models.Member,
        { _id: id },
        data,
        { new: true },
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async uploadFile(file: any, uploadPath: string) {
    try {
      if (!file || !file.image) {
        handleCustomError("FILE_NOT_UPLOAD", "ENGLISH");
      }

      const uploadedFile = file.image;
      const uploadDir = path.join(__dirname, "../../public/" + uploadPath);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFileName = `${Date.now()}_${uploadedFile.name}`;
      const finalPath = path.join(uploadDir, uniqueFileName);

      await new Promise<void>((resolve, reject) => {
        uploadedFile.mv(finalPath, (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      const imagePath = path.join(uploadPath, uniqueFileName);
      return imagePath;
    } catch (err) {
      throw err;
    }
  }
  static async changePassword(
    vendor_id: string,
    old_password: string,
    new_password: string,
    language: string,
  ) {
    try {
      const projection = { password: 1 };
      const options = { lean: false };

      const members: any = await DAO.getData(
        Models.Member,
        { _id: vendor_id },
        projection,
        options,
      );
      if (!members.length) {
        throw await handleCustomError("Member not found.", language);
      }

      const vendor = members[0];
      const isMatch = await helpers.decrypt_password(
        old_password,
        vendor.password,
      );
      if (!isMatch) {
        throw await handleCustomError(mes.oldPasswordIncorrect, language);
      }

      const hashedPassword = await helpers.bcrypt_password(new_password);
      vendor.password = hashedPassword;
      await vendor.save();

      return true;
    } catch (err) {
      throw err;
    }
  }

  static async addSocialLink(member: any, socialLinks: any, language: string) {
    if (!socialLinks || member.membership !== "Premium") {
      return undefined;
    }

    let parsedSocialLinks: any;

    if (typeof socialLinks === "string") {
      try {
        parsedSocialLinks = JSON.parse(socialLinks);
      } catch {
        throw await handleCustomError(mes.invalidSocialLinksFormat, language);
      }
    } else if (typeof socialLinks === "object") {
      parsedSocialLinks = socialLinks;
    }

    const allowedKeys = [
      "facebook",
      "instagram",
      "linkedin",
      "tiktok",
      "twitter",
      "website",
    ];

    const finalSocialLinks: any = {};

    for (const key of allowedKeys) {
      if (
        parsedSocialLinks?.[key] !== undefined &&
        parsedSocialLinks?.[key] !== ""
      ) {
        finalSocialLinks[key] = parsedSocialLinks[key];
      }
    }

    return Object.keys(finalSocialLinks).length > 0
      ? finalSocialLinks
      : undefined;
  }

  static async createProfile(member: any, profileData: any) {
    const newProfile = await Models.Profile.create(profileData);

    await DAO.findAndUpdate(
      Models.Member,
      { _id: member._id },
      { isProfile: true },
      { new: true },
    );

    return newProfile;
  }

  static async createQuoteForMember({ memberId, quoteData, file }) {
    try {
      const {
        jobId,
        clientId,
        profileId,
        description,
        language = mes.lang,
      } = quoteData;

      const existingQuote = await Models.Quote.findOne({
        jobId,
        memberId,
        profileId,
      }).lean();
      if (existingQuote) {
        throw await handleCustomError(mes.quoteAlreadyCreated, language);
      }

      const member: any = await Models.Member.findById(memberId).lean();
      if (!member) {
        throw await handleCustomError(mes.mNotFound, language);
      }

      const startOfMonth = moment().utc().startOf("month");
      const activeQuotesCount = await Models.Quote.countDocuments({
        memberId,
        createdAt: { $gte: startOfMonth },
      });

      const membershipQuoteLimits: any = {
        Free: 1,
        Basic: 4,
        Premium: Infinity,
      };

      const maxQuotes = membershipQuoteLimits[member.membership] || 0;
      if (maxQuotes !== Infinity && activeQuotesCount >= maxQuotes) {
        throw await handleCustomError(
          "You have reached the monthly quote limit",
          language,
        );
      }
      const job: any = await Models.ClientJob.findById(jobId)
        .populate("postedBy")
        .lean();
      if (!job) throw await handleCustomError("Data not found", language);
      if (job.isDeleted)
        throw await handleCustomError(
          "This job is no longer available",
          language,
        );

      const now = moment().utc();
      if (job.startDate && now.isBefore(moment(job.startDate)))
        throw await handleCustomError("Job has not started yet", language);
      if (job.closingDate && now.isAfter(moment(job.closingDate)))
        throw await handleCustomError("Job has expired", language);


      let uploadedFile: string | null = null;
      if (file) {
        uploadedFile = await uploadToS3(file, "quotes/file");
      }

      const newQuote = await Models.Quote.create({
        jobId,
        description,
        clientId,
        memberId,
        profileId,
        file: uploadedFile,
      });

      const quoteMailData = {
        email: job?.postedBy?.email || "",
        memberName: member?.fullName,
        memberEmail: member?.email,
        jobTitle: job?.projectTitle || "Your Job",
        description: newQuote.description,
        createdAt: new Date().toLocaleString(),
        membershipType: member?.membership || "N/A",
        jobLink: `${process.env.FRONTEND_URL}/client-job-listing`,
        fileUrl: newQuote?.file || "",
        companyName: "Skills$Trades",
      };

      await emailServices.quoteCreatedMail(quoteMailData);
      await emailServices.memberQuoteConfirmationMail({
        email: member?.email,
        memberName: member?.fullName,
        clientName: job?.postedBy?.fullName,
        jobTitle: job?.projectTitle,
        description: newQuote.description,
        membershipType: member?.membership,
        createdAt: new Date().toLocaleString(),
        fileUrl: newQuote?.file || "",
        dashboardLink: `${process.env.FRONTEND_URL}/member/my-quotes`,
        companyName: "Skills$Trades",
      });

      return newQuote;
    } catch (error) {
      throw error;
    }
  }
}

export default memberServices;
