import express from "express";
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
import pkg from "body-parser";
const { urlencoded, json } = pkg;

// Route imports
import loginRoutes from "./routes/login.routes.mjs";
import usersRoutes from "./routes/users.routes.mjs";
import messagesRoutes from "./routes/messages.routes.mjs";
import statisticsRoutes from "./routes/statistics.routes.mjs";

// Random SHA-256 key
import { SHAKey } from "./utils/create-key.util.mjs";
SHAKey();

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
app.use("/users", cors(corsOptions), usersRoutes);
app.use("/messages", cors(corsOptions), messagesRoutes);
app.use("/statistics", cors(corsOptions), statisticsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
