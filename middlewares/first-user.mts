// Model imports
import { getAllUsers, postUser } from "../models/users.model.mjs";

// Middleware imports
import encryptData from "../middlewares/encrypt-data.mjs";
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

async function firstUser() {
  // Encrypt first time user data
  const email = process.env["SECRET_EMAIL"];
  const name = process.env["SECRET_NAME"];

  if (email && name) {
    const { data, moreData, iv } = encryptData(email, name) || {};
    if (data && moreData && iv) {
      // Check if there are no users
      const users = await getAllUsers();
      if (users.length > 0) {
        return;
      }

      try {
        await postUser(data, moreData, iv);
        return;
      } catch (error) {
        console.log(error);
        errorLogging(error, __filename);
        return;
      }
    } else {
      const errorMessage = "process.env.SECRET_KEY || iv is undefined";
      console.log(errorMessage);
      errorLogging(errorMessage, __filename);
      return;
    }
  } else {
    const errorMessage =
      "process.env.SECRET_EMAIL || process.env.SECRET_NAME are undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return;
  }
}

export default firstUser;
