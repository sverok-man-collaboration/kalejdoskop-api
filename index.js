const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
  origin: "*",
};

app.get("/", cors(corsOptions), (req, res) => {
  res.status(200).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
