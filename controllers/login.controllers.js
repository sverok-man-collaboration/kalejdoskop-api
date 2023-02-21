// @ts-nocheck
require("dotenv").config();
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Model imports
const { USERS } = require("../models/db.model");

const emailAuth = async (req, res) => {
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
};

const verifyUser = (req, res) => {
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
};

module.exports = {
  emailAuth,
  verifyUser,
};
