import { createWriteStream } from "fs";

const logFile = createWriteStream("server-error.log", { flags: "a" });
const timestamp = new Date().toLocaleString();

function errorLogging(error: Error | unknown, path: string) {
  if (error instanceof Error) {
    logFile.write(
      `Error:\nTimestamp: ${timestamp}.\nFilepath: ${path}.\nMessage: ${error.message}.\n\n`
    );
  } else {
    logFile.write(
      `Error:\nTimestamp: ${timestamp}.\nFilepath: ${path}.\nMessage: ${error}\n\n`
    );
  }
}

export default errorLogging;
