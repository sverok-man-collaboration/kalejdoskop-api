// @ts-nocheck
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const fs = require("fs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const secretKey = require("./createKeys");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("build"));

const corsOptions = {
  origin: "*",
};

// Random key
const key = secretKey.key();
if (key) {
  console.log(secretKey.key());
}

// Mock db

const USERS = [
  {
    id: 1,
    email: "email",
    name: "name",
  },
];

let db;

jsonData();
function jsonData() {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    else {
      const parsedJson = JSON.parse(data);
      db = parsedJson;
    }
  });
}

// Admin page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

// Login
app.post("/", cors(corsOptions), async (req, res) => {
  const { email } = req.body;
  const user = USERS.find((user) => user.email === email);

  if (user) {
    const token = jwt.sign({ userId: user.id }, process.env.SECRET_JWT, {
      expiresIn: "1h",
    });

    async function main() {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.SECRET_USER,
          pass: process.env.SECRET_PASS,
        },
      });

      let info = await transporter.sendMail({
        to: `${email}`,
        subject: "Finish logging in",
        html: `<a href="http://localhost:4000/verify?token=${token}">Login</a>`,
      });

      console.log("Message sent: %s", info.messageId);
    }
    try {
      await main();
      res.send("Check your email to finish logging in");
    } catch (error) {
      if (error.responseCode === 535) {
        res.statusMessage = "SMTP Error";
        res.status(535).end();
      } else {
        console.log(error);
        res.status(500).end();
      }
    }
  } else {
    res.send("Check your email to finish logging in");
  }
});

// Verify user
app.get("/verify", cors(corsOptions), (req, res) => {
  const token = req.query.token;
  if (token === null) {
    return res.status(401).end();
  }
  try {
    console.log(token);
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    const user = USERS.find((user) => user.id === decodedToken.userId);
    res.send(`Authenticated as ${user.name}`);
  } catch (error) {
    res.status(401).end();
  }
});

// Get statistics
app.get("/statistics", cors(corsOptions), (req, res) => {
  res.status(200).json(db.statistics);
});

// Get question 1
app.get("/question1", cors(corsOptions), (req, res) => {
  res.status(200).json(db.posts.question1);
});

// Add answer to question 1
app.post("/question1", cors(corsOptions), (req, res) => {
  const { message } = req.body;
  const messageType = typeof message;
  if (messageType === "string") {
    const maxValue = Math.max(...db.posts.question1.map((number) => number.id));
    console.log(maxValue);

    db.posts.question1.push({ id: maxValue + 1, message: message });
    const stringifiedJson = JSON.stringify(db);
    fs.writeFile("./db/db.json", stringifiedJson, (err) => {
      if (err) throw err;
      else {
        res.status(204).end();
      }
    });
  } else {
    res.status(400).end();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
