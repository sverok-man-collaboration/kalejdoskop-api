import { readFile, writeFile } from "fs";

// Read from mock db
function readData() {
  return new Promise((resolve, reject) => {
    readFile("./database/db.json", (error, data) => {
      if (error) {
        reject(error);
      } else {
        const parsedJson: object = JSON.parse(data.toString());
        resolve(parsedJson);
      }
    });
  });
}

// Write to mock db
function writeData(stringifiedJson: string) {
  return new Promise<void>((resolve, reject) => {
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
