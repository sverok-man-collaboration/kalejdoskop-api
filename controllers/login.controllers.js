// @ts-nocheck
require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const errorLogging = require("../middlewares/error-logging");

// Model imports
const { readData } = require("../models/db.model");

// Email authentication method
const emailAuth = async (req, res) => {
  const { email } = req.body;
  let user;
  try {
    const db = await readData();
    user = db.users.admin.find((user) => user.email === email);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }

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
        console.log(error);
        res.statusMessage = "SMTP Error";
        errorLogging(error, __filename);
        res.status(535).end();
      } else {
        console.log(error);
        errorLogging(error, __filename);
        res.status(500).end();
      }
    }
  } else {
    res.send("Check your email to finish logging in");
  }
};

// Verify user token method
const verifyUser = async (req, res) => {
  const token = req.query.token;

  if (token === null) {
    return res.status(401).end();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
    let user;
    try {
      const db = await readData();
      user = db.users.admin.find((user) => user.id === decodedToken.userId);
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }

    res.send(`Authenticated as ${user.name}`);
  } catch (error) {
    console.log(error);
    res.status(401).end();
  }
};

module.exports = {
  emailAuth,
  verifyUser,
};
