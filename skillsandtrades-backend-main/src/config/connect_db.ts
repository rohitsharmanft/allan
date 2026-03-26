import mongoose from "mongoose";
import { config } from "dotenv";
config();
import db_config from "./db_config";
import { bootstrap_data } from "./index";

const connect_to_db = async () => {
  let { URI } = db_config;

  await mongoose.connect(URI);
  console.log("connected to MongoDb")
  mongoose.connection.on("connected", (data: any) => {
    console.log("SERVER LOAD");
    console.log("connected to MongoDb");
  });
  mongoose.connection.on("error", (error: any) => {
    console.log(error);
  });
  bootstrap_data();
};

export default connect_to_db;
