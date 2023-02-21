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

// Mock db
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

module.exports = { USERS, jsonData };
