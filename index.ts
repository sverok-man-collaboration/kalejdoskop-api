// Dotenv import
import * as dotenv from "dotenv";
dotenv.config();

// Express import
import express from "express";

// Middlewares imports
import { verifyToken } from "./middlewares/authenticate-token.mjs";
import cors from "cors";
import {
  contentSecurityPolicy,
  crossOriginEmbedderPolicy,
  crossOriginOpenerPolicy,
  crossOriginResourcePolicy,
  dnsPrefetchControl,
  expectCt,
  frameguard,
  hidePoweredBy,
  hsts,
  ieNoOpen,
  noSniff,
  originAgentCluster,
  permittedCrossDomainPolicies,
  referrerPolicy,
  xssFilter,
} from "helmet";
import encryptData from "./middlewares/encrypt-data.mjs";
import errorLogging from "./middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
import pkg from "body-parser";
const { urlencoded, json } = pkg;

// Utility imports
import generateJWT from "./utils/create-key.util.mjs";

// Route imports
import loginRoutes from "./routes/login.routes.mjs";
import usersRoutes from "./routes/users.routes.mjs";
import messagesRoutes from "./routes/messages.routes.mjs";
import statisticsRoutes from "./routes/statistics.routes.mjs";

// Generate key
generateJWT();

// Encrypt first time user data

const email = process.env["SECRET_EMAIL"];
const name = process.env["SECRET_NAME"];

if (email && name) {
  const { data, moreData, iv } = encryptData(email, name) || {};
  if (data && moreData && iv) {
    console.log(`Encrypted email: ${data}`);
    console.log(`Encrypted name: ${moreData}`);
    console.log(`IV: ${iv}`);
  } else {
    const errorMessage = "process.env.SECRET_KEY || iv is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
  }
} else {
  const errorMessage =
    "process.env.SECRET_EMAIL and process.env.SECRET_NAME are undefined";
  console.log(errorMessage);
  errorLogging(errorMessage, __filename);
}

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(contentSecurityPolicy());
app.use(crossOriginEmbedderPolicy());
app.use(crossOriginOpenerPolicy());
app.use(crossOriginResourcePolicy());
app.use(dnsPrefetchControl());
app.use(expectCt());
app.use(frameguard());
app.use(hidePoweredBy());
app.use(hsts());
app.use(ieNoOpen());
app.use(noSniff());
app.use(originAgentCluster());
app.use(permittedCrossDomainPolicies());
app.use(referrerPolicy());
app.use(xssFilter());
app.use(urlencoded({ extended: false }));
app.use(json());

// Valid origins
const corsOptions = {
  origin: "*",
};

// Routes
app.use("/login", cors(corsOptions), loginRoutes);
app.use("/users", cors(corsOptions), verifyToken, usersRoutes);
app.use("/messages", cors(corsOptions), messagesRoutes);
app.use("/statistics", cors(corsOptions), statisticsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
