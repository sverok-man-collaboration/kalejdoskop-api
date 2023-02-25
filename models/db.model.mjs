import { readFile, writeFile } from "fs";

// Read from mock db
function readData() {
  return new Promise((resolve, reject) => {
    readFile("./database/db.json", (error, data) => {
      if (error) {
        reject(error);
      } else {
        const parsedJson = JSON.parse(data.toString());
        resolve(parsedJson);
      }
    });
  });
}

/**
 * Write to mock db
 * @param {string} stringifiedJson
 * @returns {Promise<void>}
 */
function writeData(stringifiedJson) {
  return new Promise((resolve, reject) => {
    writeFile("./database/db.json", stringifiedJson, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export { readData, writeData };
