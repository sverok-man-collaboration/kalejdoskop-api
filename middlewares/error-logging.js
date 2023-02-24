// @ts-nocheck
const fs = require("fs");

const logFile = fs.createWriteStream("server-error.log", { flags: "a" });

const timestamp = new Date().toLocaleString();

function errorLogging(error, path) {
  logFile.write(
    `Error:\nTimestamp: ${timestamp}.\nFilepath: ${path}.\nMessage: ${error}.\n\n`
  );
}

module.exports = errorLogging;
