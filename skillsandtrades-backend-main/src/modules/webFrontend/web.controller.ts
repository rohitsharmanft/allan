import express from "express";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";
import {
  handleCatch,
  handleCustomError,
  helpers,
  sendResponse,
} from "../../middlewares/index";
import { profileWithReview } from "../member/member.aggration";


class webController {

  static async contactUs(req: any, res: express.Response) {
    try {
      const { fullName, email, phoneNumber, message } = req.body
      const data: any = {
        fullName,
        email: email.toLowerCase().trim(),
        phoneNumber,
        message: message,
      };

      const response = await DAO.saveData(Models.ContactUs, data)
      sendResponse(res, response, "Success")

    } catch (err) {
      handleCatch(res, err)
    }
  }

  static async skillDetalsWithReviewList(req: any, res: express.Response) {
    try {
      const { id: profileId } = req.params;

      const details = await profileWithReview(Models.Profile, profileId);

      sendResponse(res, details, "Data fetched successfully.");
    } catch (error) {
      handleCatch(res, error);
    }
  }



}

export default webController;
