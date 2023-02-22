// @ts-nocheck
const fs = require("fs");

// Mock users
const USERS = [
  {
    id: 1,
    email: "email",
    name: "name",
  },
];

// Read from mock db
function jsonData() {
  return new Promise((resolve, reject) => {
    fs.readFile("./db/db.json", (error, data) => {
      if (error) {
        reject(error);
      } else {
        const parsedJson = JSON.parse(data);
        resolve(parsedJson);
      }
    });
  });
}

// Write to mock db
function writeData(stringifiedJson) {
  return new Promise((resolve, reject) => {
    fs.writeFile("./db/db.json", stringifiedJson, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { USERS, jsonData, writeData };
