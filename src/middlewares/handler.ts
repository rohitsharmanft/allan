import * as DAO from "../DAO/index";
import * as Models from "../models";

const handleSuccess = (reply: any, response: any) => {
  reply.send({
    data: response,
    status: true,
    code: 200,
  });
};

const sendResponse = (reply: any, response: any, message: any) => {
  reply.send({
    data: response,
    status: true,
    code: 200,
    message: message,
  });
};

const handleCatch = (reply: any, error: any) => {
  console.log("-------------------error-->", error);

  let { type, status_code, error_message } = error;
  if (type == undefined) {
    type = "Bad Request";
  }
  if (status_code == undefined) {
    status_code = 400;
  }
  if (error_message == undefined) {
    error_message = error;
  }

  reply.status(status_code).send({
    error: type,
    error_description: error_message,
    status: false,
    code: 400,
  });
};
const handleCustomError = async (type: string, language: string) => {
  try {

    let query = { message_type: type };
    let projection = { __v: 0 };
    let options = { lean: true };
    let fetch_data: any = await DAO.getData(
      Models.ResMessages,
      query,
      projection,
      options
    );


    if (fetch_data.length ) {
     
      let { message_type, code, msg_in_english } = fetch_data[0];

      let error_message = "Something went wrong";
      if (language == "ENGLISH") {
        error_message = msg_in_english;
      } else {
        message_type = "INVALID_LANGUAGE";
        error_message = "Sorry this is not a valid language";
      }
      let data = {
        type: message_type,
        code: code,
        error_message: error_message,
      };
      return {
        type: message_type,
        code: code,
        error_message: error_message,
      };
    } 
    else if(!fetch_data.length){
   
         
         return type;
    }
    
    else {
      throw new Error("Invalid error type");
    }
  } catch (err) {
    throw err;
  }
};

const handleJoiError = async (error: any) => {
  let error_message = error.details[0].message;
  let custom_message = error_message.replace(/"/g, "");
  throw {
    status_code: 400,
    type: "Joi Error",
    error_message: custom_message,
  };
};

export {
  handleCatch,
  handleSuccess,
  handleCustomError,
  handleJoiError,
  sendResponse,
};
