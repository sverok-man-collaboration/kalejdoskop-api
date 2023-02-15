// @ts-nocheck
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const fs = require("fs");

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

app.get("/statistics", cors(corsOptions), (req, res) => {
  res.status(200).json(db.statistics);
});

app.get("/question1", cors(corsOptions), (req, res) => {
  res.status(200).json(db.posts.question1);
});

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
