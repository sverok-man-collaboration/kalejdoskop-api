// @ts-nocheck
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const secretKey = require("./utils/create-key.util");

// Route imports
const loginRoutes = require("./routes/login.routes");
const usersRoutes = require("./routes/users.routes");
const messagesRoutes = require("./routes/messages.routes");
const statisticsRoutes = require("./routes/statistics.routes");

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Valid origins
const corsOptions = {
  origin: "*",
};

// Random SHA-256 key
const key = secretKey.key();
if (key) {
  console.log(secretKey.key());
}

// Render adminpanel website
app.use(express.static("public/dist", cors(corsOptions)));

// Routes
app.use("/", cors(corsOptions), loginRoutes);
app.use("/users", cors(corsOptions), usersRoutes);
app.use("/messages", cors(corsOptions), messagesRoutes);
app.use("/statistics", cors(corsOptions), statisticsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
