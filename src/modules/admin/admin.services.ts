import * as DAO from "../../DAO/index";
import * as Models from "../../models";
import { app_constant } from "../../config/index";
const admin_scope = app_constant.scope.admin;
import {
  generate_token,
  handleCustomError,
  helpers,
} from "../../middlewares/index";
import path from "path";
import fs from "fs";
import { deleteFromS3 } from "../../middlewares/s3Client";

class adminServices {
  static async saveSessionData(access_token: any, token_data: any) {
    try {
      let { _id: admin_id, token_gen_at, expire_time } = token_data;
      let set_data = {
        type: "ADMIN",
        admin_id: admin_id,
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

  static async fetchAdminToken(token_data: any) {
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

  static async generateAdminToken(_id: string) {
    try {
      let token_data = {
        _id: _id,
        scope: admin_scope,
        collection: Models.Admin,
        token_gen_at: +new Date(),
      };
      let response = await this.fetchAdminToken(token_data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async makeAdminResponse(data: any, language: string) {
    try {
      let { admin_id, token_gen_at, access_token } = data;

      let query = { _id: admin_id };
      let projection = { password: 0 };
      let options = { lean: true };
      let fetch_data: any = await DAO.getData(
        Models.Admin,
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

  static async verifyAdmin(query: any) {
    try {
      let projection = { __v: 0 };
      let options = { lean: true };
      let response = await DAO.getData(
        Models.Admin,
        query,
        projection,
        options
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async updateAdmin(id: any, req_data: any, file: any) {
    try {
      const { fullName, language = "ENGLISH" } = req_data;
      const projection = { __v: 0 };
      const options = { lean: true };

      const check: any = await DAO.getData(
        Models.Admin,
        { _id: id },
        projection,
        options
      );
      if (!check.length) {
        throw await handleCustomError("NO_DATA_FOUND", language);
      }
      console.log("check>>>>>", check[0].image, check);
      const img = check[0].image;
      console.log("object", img)
      if (file) {
        await deleteFromS3(check[0].image);
      }

      const data: any = {
        fullName,
      };

      if (file) {
        data.image = file;
      }

      const response = await DAO.findAndUpdate(
        Models.Admin,
        { _id: id },
        data,
        options
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async createUser(req_data: any, file: any) {
    try {
      const { full_name, email, language } = req_data;
      const projection = { __v: 0 };
      const options = { lean: true };
      const check: any = await DAO.getData(
        Models.Users,
        { email: email.toLowerCase() },
        projection,
        options
      );
      if (check.length > 0) {
        throw await handleCustomError("THIS_DATA_ALREADY_EXIT", language);
      }

      let number = Math.floor(100000 + Math.random() * 900000);

      const data: any = {
        full_name: full_name,
        email: email.toLowerCase(),
        add_by: "ADMIN",
        otp: number,
      };
      if (file) {
        let image = await this.uploadFile(file, "uploads/user/image");
        data.image = image;
      }
      const response = await DAO.saveData(Models.Users, data);
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async editUser(id: any, req_data: any, file: any) {
    try {
      const { full_name, email, language } = req_data;
      const projection = { __v: 0 };
      const options = { lean: true };
      const check: any = await DAO.getData(
        Models.Users,
        { _id: req_data._id },
        projection,
        options
      );
      if (!check.length) {
        throw await handleCustomError("NO_DATA_FOUND", language);
      }

      const data: any = {
        full_name: full_name,
      };
      if (file) {
        let image = await this.uploadFile(file, "uploads/user/image");
        data.image = image;
      }
      const response = await DAO.findAndUpdate(
        Models.Users,
        { _id: id },
        data,
        options
      );
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async uploadFile(file: any, uploadPath: string) {
    try {
      if (!file || !file.file) {
        throw await handleCustomError("FILE_NOT_UPLOAD", "ENGLISH");
      }

      const uploadedFile = file;
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

  static async createBlog(req_data: any, file: any) {
    try {
      const { heading, description, categoryId } = req_data;
      console.log("req_data: ", req_data);
      console.log("file: ", file);
      let image: string | null = null;


      const response: any = await Models.Blogs.create({
        heading,
        description,
        image: file,
        categoryId,
      });
      return response;
    } catch (err) {
      throw err;
    }
  }

  static async updateBlog(req_data: any, file: any) {
    try {
      const { id, heading, description, categoryId, language } = req_data;
      if (!id) {
        throw await handleCustomError("MISSING_REQUIRED_FIELDS", "ENGLISH");
      }

      let image: string | null = null;
      console.log("file:: ", file);
      if (file) {

        image = file;
      }

      const updateData: any = {};

      if (heading !== undefined) updateData.heading = heading;
      if (description !== undefined) updateData.description = description;
      if (categoryId !== undefined) updateData.categoryId = categoryId;
      if (image) updateData.image = image;

      const options = { new: true, lean: true };
      const query = { _id: id };

      const updatedContent = await DAO.findAndUpdate(
        Models.Blogs,
        query,
        updateData,
        options
      );

      if (!updatedContent) {
        throw await handleCustomError("BLOG_NOT_FOUND", "ENGLISH");
      }
      return updatedContent;
    } catch (err) {
      throw err;
    }
  }

  static async fetchNotifications(limit: number, offset: number) {
    const query = {};
    const projection = { __v: 0 };
    const options = {
      lean: true,
      sort: { createdAt: -1 },
      skip: offset,
      limit: limit
    };

    const notifications = await DAO.getData(Models.Notifications, query, projection, options);
    const totalCount = await DAO.countData(Models.Notifications, query);

    return {
      notifications,
      totalCount
    };
  }

  static async markRead(id: string) {
    const query = { _id: id };
    const update = { isRead: true };
    return await DAO.findAndUpdate(Models.Notifications, query, update, { new: true });
  }

  static async fetchContactUsList(limit: number, offset: number) {
    try {
      const response = await Models.ContactUs.aggregate([
        { $sort: { createdAt: -1 } },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            totalCount: [{ $count: "count" }],
          },
        },
      ]);
      return response;
    } catch (err) {
      throw err;
    }
  }
}

export default adminServices;
