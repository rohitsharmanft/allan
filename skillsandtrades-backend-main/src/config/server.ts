import express from "express";
import { config } from "dotenv";
config();
import http from "http";
import fs from "fs";
import https from "https";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { connect_to_db, bootstrap_data } from "./index";
import adminRoutes from "../modules/admin/admin.routes";
import userRoutes from "../modules/user/user.routes";
import memberRoutes from "../modules/member/member.routes";
import payfastRoutes from "../modules/payfast/psyfast.routes";
// import paymentRoutes from "../modules/payfast/payfast.routes";
import webRoutes from "../modules/webFrontend/web.routes";
import logger from "morgan";
import cors from "cors";
import path from "path";
import * as Models from "../models/index";
import moment from "moment";
import { mongo } from "mongoose";
// import Category from "../models/Category";

const app = express();

const env = process.env.ENVIRONMENT;
const cert: any = process.env.SSL_CERT;
const priv_key: any = process.env.SSL_PRIV_KEY;
console.log("----------env-------", env);
let port: any;
if (env == "PROD") {
  port = process.env.PROD_PORT;
} else {
  port = process.env.LOCAL_PORT;
}
console.log("PORT---", port);

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({
    extended: true,
    verify: (req: any, res, buf) => {
      if (req.originalUrl === "/Member/payment/itn") {
        req.rawBody = buf.toString();
      }
    },
  }),
);
// app.use(
//   express.json({
//     verify: (req: any, res, buf) => {
//       if (req.originalUrl.startsWith("/Member/payment/itn")) {
//         req.rawBody = buf.toString();
//       }
//     },
//   }),
// );

// app.use(
//   express.urlencoded({
//     extended: true,
//     verify: (req: any, res, buf) => {
//       if (req.originalUrl.startsWith("/Member/payment/itn")) {
//         req.rawBody = buf.toString();
//       }
//     },
//   }),
// );

app.use(express.static(path.join(__dirname, "../public")));
app.use(cors({ origin: "*" }));
app.use(fileUpload());
app.use(logger("dev"));

// app.options("*", cors());

const apiLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(apiLogger);

app.get("/", (req: any, res: any) => {
  const userIP = req.ip;
  res.send(`Your IP address is: ${userIP}`);
});
app.use("/Admin/api", adminRoutes);
app.use("/User/api", userRoutes);
app.use("/Member/api", memberRoutes);
app.use("/Web/api", webRoutes);
app.use("/Member/payment", payfastRoutes);

let server: any;

if (process.env.SSL == "true") {
  server = https.createServer(
    {
      cert: fs.readFileSync(cert),
      key: fs.readFileSync(priv_key),
    },
    app,
  );
  server.listen(port, () => {
    console.log(`Server running at port at ${port}...`);
  });
} else {
  server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Server1 running at port at ${port}...`);
  });
}

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }
  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + "requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe" + addr : "port " + addr.port;
  console.log("bind ", bind);
}

server.on("error", onError);
server.on("listening", onListening);
console.log(`port running ${port}`);

connect_to_db();

