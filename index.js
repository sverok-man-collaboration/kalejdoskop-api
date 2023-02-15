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

let statistics;

jsonData("get");
function jsonData(getData) {
  fs.readFile("db.json", (err, data) => {
    if (err) throw err;
    else {
      const parsedJson = JSON.parse(data);
      if (getData === "get") {
        statistics = parsedJson.jsonStatistics;
      }
    }
  });
}

// Admin page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

app.get("/statistics", cors(corsOptions), (req, res) => {
  res.status(200).json(statistics);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
