import bcrypt from "bcrypt";
import * as DAO from "../DAO";
import * as Models from "../models/index";
import random_string from "randomstring";
import { app_constant } from "../config/index";
const default_limit = app_constant.default_limit;
const salt_rounds = app_constant.salt_rounds;



const set_options = async (pagination: any, limit: any) => {
  try {
    let options: any = {
      lean: true,
      sort: { _id: -1 },
    };

    if (pagination == undefined && typeof limit != undefined) {
      options = {
        lean: true,
        limit: parseInt(limit),
        sort: { _id: -1 },
      };
    } else if (typeof pagination != undefined && limit == undefined) {
      options = {
        lean: true,
        skip: parseInt(pagination) * default_limit,
        limit: default_limit,
        sort: { _id: -1 },
      };
    } else if (typeof pagination != undefined && typeof limit != undefined) {
      options = {
        lean: true,
        skip: parseInt(pagination) * parseInt(limit),
        limit: parseInt(limit),
        sort: { _id: -1 },
      };
    }

    return options;
  } catch (err) {
    throw err;
  }
};

const generate_otp = async () => {
  try {
    let options = {
      length: 6,
      charset: "123456789",
    };
    let code = random_string.generate(options);
    return code;
  } catch (err) {
    throw err;
  }
};

const gen_unique_code = async (collection: any) => {
  try {
    let options = {
      length: 7,
      charset: "alphanumeric",
    };
    let random_value = random_string.generate(options);

    // fetch users count
    let total_users = await DAO.countData(collection, {});
    let inc_value = Number(total_users) + 1;

    // unique code
    let unique_code = `${random_value}${inc_value}`;
    return unique_code;
  } catch (err) {
    throw err;
  }
};

const bcrypt_password = async (password: string) => {
  try {
    const hash = await bcrypt.hash(password, salt_rounds);

    return hash;
  } catch (err) {
    throw err;
  }
};

const decrypt_password = async (password: string, hash: string) => {
  try {
    const decryt = await bcrypt.compareSync(password, hash);
    return decryt;
  } catch (err) {
    throw err;
  }
};

const dataWithPaginationForQuery = (
  items: any[],
  offset: number,
  limit: number
) => {
  const totalCount = items.length;
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const paginatedData = items.slice(offset, offset + limit);

  return {
    data: paginatedData,
    pagination: {
      totalCount,
      totalPages,
      currentPage,
    },
  };
};

const dataWithPagination = (
  aggregateData: any,
  offset: number,
  limit: number
) => {
  const totalCount =
    (aggregateData.length > 0 && aggregateData[0]?.totalCount[0]?.count) || 0;

  let totalPages = Math.ceil(totalCount / limit);
  let currentPage = Math.floor(offset / limit) + 1;

  //    let prevPage = currentPage - 1 > 0 ? (currentPage - 1) * limit : 0;
  //    let nextPage = currentPage + 1 <= totalPages ? currentPage * limit : 0;

  return {
    data: (aggregateData.length > 0 && aggregateData[0]?.data) || [],
    pagination: {
      totalCount,
      //    nextPage,
      //    prevPage,
      totalPages,
      currentPage: currentPage,
    },
  };
};

const customBodyParser = (data: any) => {
  data["limit"] = data["limit"] ? parseInt(data["limit"]) : 10;
  data["offset"] = data["offset"] ? parseInt(data["offset"]) : 0;
  data["order"] = data["order"] ? parseInt(data["order"]) : null;
  data["sort"] = data["sort"] ? data["sort"] : null;
  data["search"] = data["search"] ? data["search"] : null;
  return data;
};

const removeSrcPrefix = (path: string) => {
  return path.replace(/^(src\/|dist\/)/, "");
};
const MEMBER_FIELDS = [
  "fullName",
  "gender",
  "phoneNumber",
  "whatsappNumber",
  "image",
  "categoryId",
  "businessTradingName",
  "skillIds",
  "country",
];

const PROFILE_FIELDS = [
  "skillIds",
  "categoryId",
  "workDescription",
  "overview",
  "socialLinks",
  "workLocation",
  "longitude",
  "latitude",
  "location",
  "photoGallery",
  "businessTradingName",
];

export {
  set_options,
  generate_otp,
  gen_unique_code,
  bcrypt_password,
  decrypt_password,
  dataWithPagination,
  customBodyParser,
  removeSrcPrefix,
  dataWithPaginationForQuery,
  MEMBER_FIELDS,
  PROFILE_FIELDS,
};
