import { createWriteStream } from "fs";

const logFile = createWriteStream("server-error.log", { flags: "a" });
const timestamp = new Date().toLocaleString();

/**
 * @param {*} error
 * @param {string} path
 */
function errorLogging(error, path) {
  logFile.write(
    `Error:\nTimestamp: ${timestamp}.\nFilepath: ${path}.\nMessage: ${error.message}.\n\n`
  );
}

export default errorLogging;
