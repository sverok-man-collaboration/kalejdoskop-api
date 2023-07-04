// Dotenv import
import * as dotenv from "dotenv";
dotenv.config();

// Express import
import express from "express";

// Middlewares imports
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
import originCheck from "./middlewares/origin-apikey-check.mjs";
import verifyToken from "./middlewares/authenticate-token.mjs";
import firstUser from "./middlewares/first-user.mjs";
import statisticsData from "./middlewares/statistics-data.mjs";
import pkg from "body-parser";
const { urlencoded, json } = pkg;

// Route imports
import loginRoutes from "./routes/login.routes.mjs";
import usersRoutes from "./routes/users.routes.mjs";
import messagesRoutes from "./routes/messages.routes.mjs";
import statisticsRoutes from "./routes/statistics.routes.mjs";

// Add first time user
firstUser();

// Add statistics data
statisticsData();

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

// Routes
app.use("/login", originCheck, loginRoutes);
app.use("/users", originCheck, verifyToken, usersRoutes);
app.use("/messages", originCheck, messagesRoutes);
app.use("/statistics", originCheck, statisticsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
