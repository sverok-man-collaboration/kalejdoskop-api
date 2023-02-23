// @ts-nocheck
const fs = require("fs");

const logFile = fs.createWriteStream("server-error.log", { flags: "a" });

function errorLogging(error, path) {
  logFile.write(`Error filepath: ${path}. Error message: ${error}`);
}

module.exports = errorLogging;
