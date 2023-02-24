const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const SHAKey = require("./utils/create-key.util");

// Route imports
const loginRoutes = require("./routes/login.routes");
const usersRoutes = require("./routes/users.routes");
const messagesRoutes = require("./routes/messages.routes");
const statisticsRoutes = require("./routes/statistics.routes");

// Random SHA-256 key
SHAKey();

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(helmet.contentSecurityPolicy());
app.use(helmet.crossOriginEmbedderPolicy());
app.use(helmet.crossOriginOpenerPolicy());
app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Valid origins
const corsOptions = {
  origin: "*",
};

// Render adminpanel website
app.use(express.static("public/dist"));

// Routes
app.use("/", cors(corsOptions), loginRoutes);
app.use("/users", cors(corsOptions), usersRoutes);
app.use("/messages", cors(corsOptions), messagesRoutes);
app.use("/statistics", cors(corsOptions), statisticsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
