import express, { response } from "express";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";
import { app_constant } from "../../config/index";
const user_scope = app_constant.scope.user;
import {
  handleCustomError,
  helpers,
  generate_token,
} from "../../middlewares/index";
import path from "path";
import fs from "fs";
import axios from "axios";

class userServices {
  static async saveSessionData(access_token: any, token_data: any) {
    try {
      let { _id, token_gen_at, expire_time } = token_data;
      let set_data = {
        type: "USER",
        user_id: _id,
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

  static async fetchUserToken(token_data: any) {
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

  static async generateUserToken(_id: string) {
    try {
      let token_data = {
        _id: _id,
        scope: user_scope,
        collection: Models.Users,
        token_gen_at: +new Date(),
      };
      let response = await this.fetchUserToken(token_data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async makeUserResponse(data: any, language: string) {
    try {
      let { user_id, token_gen_at, access_token } = data;

      let query = { _id: user_id };
      let projection = { password: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Users,
        query,
        projection,
        options
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

  static async verifyUser(query: any) {
    try {
      let projection = { __v: 0 };
      let options = { lean: true };
      let response = await DAO.getData(
        Models.Users,
        query,
        projection,
        options
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async createUser(req_data: any) {
    try {
      const {
        fullName,
        email,
        password,
        phoneNumber,
        city,
        state,
        country,
        // clientType,
        language = "ENGLISH",
      } = req_data;
      const projection = { __v: 0 };
      const options = { lean: true };
      const check: any = await DAO.getData(
        Models.Users,
        { email: email.toLowerCase() },
        projection,
        options
      );
      if (check.length > 0) {
        throw await handleCustomError("THIS_DATA_ALREADY_EXIST", language);
      }
      let number = Math.floor(100000 + Math.random() * 900000);
      const hashedPassword = await helpers.bcrypt_password(password);

      const data: any = {
        fullName: fullName,
        email: email.toLowerCase(),
        password: hashedPassword,
        otp: number,
        phoneNumber,
        // clientType,
        city,
        state,
        country,
      };
      const response = await DAO.saveData(Models.Users, data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  // static async createUser1(req_data: any, file: any) {
  //   try {
  //     const {
  //       full_name,
  //       email,
  //       password,
  //       phone_number,

  //       location,
  //       language = "ENGLISH",
  //     } = req_data;
  //     const projection = { __v: 0 };
  //     const options = { lean: true };
  //     const check: any = await DAO.getData(
  //       Models.Users,
  //       { email: email.toLowerCase() },
  //       projection,
  //       options
  //     );
  //     if (check.length > 0) {
  //       throw await handleCustomError("THIS_DATA_ALREADY_EXIT", language);
  //     }

  //     const hashedPassword = await helpers.bcrypt_password(password);

  //     const data: any = {
  //       full_name: full_name,
  //       email: email.toLowerCase(),
  //       password: hashedPassword,
  //       add_by: "SELF",
  //       phone_number,
  //       location,
  //       image: file,
  //     };
  //     const response = await DAO.saveData(Models.Users, data);
  //     return response;
  //   } catch (err) {
  //     throw err;
  //   }
  // }

  static async editUser(id: any, req_data: any, file: any) {
    try {
      const {
        fullName,
        phoneNumber,
        whatsappNumber,
        address,
        country,
        state,
        city,
        postCode,
        gender,
        language = "ENGLISH",
      } = req_data;
      const projection = { __v: 0 };
      const options = { lean: true };
      const check: any = await DAO.getData(
        Models.Users,
        { _id: id },
        projection,
        options
      );
      if (!check.length) {
        throw await handleCustomError("NO_DATA_FOUND", language);
      }
      const data: any = {
        fullName: fullName,
        phoneNumber,
        whatsappNumber,
        address,
        country,
        state,
        city,
        postCode,
        gender,
      };
      if (file) {
        data.image = file;
      }
      const response = await DAO.findAndUpdate(
        Models.Users,
        { _id: id },
        data,
        { new: true }
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async changePassword(
    user_id: string,
    old_password: string,
    new_password: string,
    language: string
  ) {
    try {
      const projection = { password: 1 };
      const options = { lean: false };

      const users: any = await DAO.getData(
        Models.Users,
        { _id: user_id },
        projection,
        options
      );
      if (!users.length) {
        throw await handleCustomError("NO_DATA_FOUND", language);
      }

      const user = users[0];
      const isMatch = await helpers.decrypt_password(
        old_password,
        user.password
      );
      if (!isMatch) {
        throw await handleCustomError("INCORRECT_OLD_PASSWORD", language);
      }

      const hashedPassword = await helpers.bcrypt_password(new_password);
      user.password = hashedPassword;
      await user.save();

      return true;
    } catch (err) {
      throw err;
    }
  }

  static async uploadFile(file: any, uploadPath: string) {
    try {
      if (!file || !file.file) {
        handleCustomError("FILE_NOT_UPLOAD", "ENGLISH");
      }

      const uploadedFile = file.file;
      const uploadDir = path.join(__dirname, "../../public/" + uploadPath);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uniqueFileName = `${Date.now()}_${uploadedFile.name}`;
      const finalPath = path.join(uploadDir, uniqueFileName);

      await new Promise<void>((resolve, reject) => {
        uploadedFile.mv(finalPath, (err) => {
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

  static async getTextFromOpenAI(topic: any) {
    const prompt = `Create presentations for "${topic}" slides.`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.choices[0].message.content;
      const slides = data.trim().split(/\n\s*\n/);

      const ppt_slides = await Promise.all(
        slides.map(async (slide) => {
          const lines = slide.split("\n").map((line) => line.trim());

          const title = lines[0];
          const content = lines
            .slice(1)
            .filter((line) => !line.toLowerCase().includes("image:"));

          const slideData = {
            Title: title,
            Content: content,
            // "Image": content[0]
            Image:
              "http://localhost:6004/uploads/user/image/1729667686202_demo.jpg",
            x: 0,
            y: 0,
          };

          return slideData;
        })
      );

      return ppt_slides;
    } catch (error) {
      console.error("Error generating slides:", error);
      throw error;
    }
  }

  static async getContent(req_data: any) {
    const topic = req_data.content;
    const number = req_data.number;
    const text = await this.getTextFromOpenAI(topic);
    return { topic, text };
  }

}

export default userServices;
