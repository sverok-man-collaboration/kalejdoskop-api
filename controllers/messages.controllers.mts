// Model imports
import {
  getAllMessages,
  getThreeRandomMessages,
  postMessage,
  patchMessage,
  patchStatus,
} from "../models/messages.model.mjs";

// Middleware imports
import getNewToken from "../middlewares/new-token.mjs";
import encryptData from "../middlewares/encrypt-data.mjs";
import decryptData from "../middlewares/decrypt-data.mjs";
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// Type imports
import type { Request, Response } from "express";

// Get all messages method
const getAllMessagesController = async (req: Request, res: Response) => {
  // Token has already been verified by authenticate-token middleware
  const authHeader = req.headers["authorization"]?.toString();
  const token = authHeader?.split(" ")[1] as string;

  // Get new Token
  const newToken = getNewToken(token);
  if (newToken === "Invalid token") {
    console.log("Invalid token");
    return res.status(401).end();
  } else if (newToken === "SECRET_KEY is undefined") {
    const errorMessage = "process.env.SECRET_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(500).end();
  }

  try {
    const messages = await getAllMessages();

    // Decrypting message
    for (const message of messages) {
      try {
        if (message.iv) {
          const decryptedMessage = decryptData(message.message, message.iv);

          if (decryptedMessage) {
            message.message = decryptedMessage;
            delete message.iv;
          } else {
            throw new Error("process.env.SECRET_KEY is undefined");
          }
        } else {
          throw new Error("Iv is undefined for message" + message.id);
        }
      } catch (error) {
        console.log(error);
        errorLogging(error, __filename);
      }
    }
    return res.status(200).json({ newToken, messages });
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

// Get three random messages method
const getThreeRandomMessagesController = async (
  req: Request,
  res: Response
) => {
  const { room, object } = req.params;
  if (!room || !object) {
    return res.status(400).end();
  }

  try {
    const data = await getThreeRandomMessages(room, object);

    // Decrypting message
    for (const message of data) {
      try {
        if (message.iv) {
          const decryptedMessage = decryptData(message.message, message.iv);

          if (decryptedMessage) {
            message.message = decryptedMessage;
            delete message.iv;
          } else {
            throw new Error("process.env.SECRET_KEY is undefined");
          }
        } else {
          throw new Error("Iv is undefined for message" + message.id);
        }
      } catch (error) {
        console.log(error);
        errorLogging(error, __filename);
      }
    }
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

// Post message method
const postMessageController = async (req: Request, res: Response) => {
  const { room, object, message } = req.body;
  const roomType = typeof room;
  const objectType = typeof object;
  const messageType = typeof message;

  const roomData = [
    { room: "Milous", object: ["Säng", "Present"] },
    { room: "Liams", object: ["Hantlar", "Brev"] },
    { room: "Polkas", object: ["Dator", "Spelkonsol"] },
  ];

  // Filter roomData to include only objects that match the given room and object
  const filteredRoomData = roomData.filter(
    (data) => data.room === room && room.object.includes(object)
  );

  if (
    filteredRoomData.length === 0 ||
    roomType !== "string" ||
    objectType !== "string" ||
    messageType !== "string"
  ) {
    return res.status(400).end();
  }

  // Encrypting message
  const { data, iv } = encryptData(message) || {};

  if (!data) {
    const errorMessage = "process.env.SECRET_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(500).end();
  } else if (!iv) {
    const errorMessage = "iv is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(500).end();
  }

  try {
    await postMessage(room, object, data, iv);
    return res.status(204).end();
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return res.status(500).end();
  }
};

// Patch message method
const patchMessageController = async (req: Request, res: Response) => {
  const { id, status, message } = req.body;
  const idType = typeof id;
  const statusType = typeof status;
  const messageType = typeof message;

  if (
    idType !== "number" ||
    statusType !== "string" ||
    messageType !== "string"
  ) {
    return res.status(400).end();
  }

  // Token has already been verified by authenticate-token middleware
  const authHeader = req.headers["authorization"]?.toString();
  const token = authHeader?.split(" ")[1] as string;

  // Get new Token
  const newToken = getNewToken(token);
  if (newToken === "Invalid token") {
    console.log("Invalid token");
    return res.status(401).end();
  } else if (newToken === "SECRET_KEY is undefined") {
    const errorMessage = "process.env.SECRET_KEY is undefined";
    console.log(errorMessage);
    errorLogging(errorMessage, __filename);
    return res.status(500).end();
  }

  if (message === "") {
    try {
      await patchStatus(id, status);
      return res.status(200).json({ newToken });
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      return res.status(500).end();
    }
  } else {
    // Encrypting message
    const { data, iv } = encryptData(message) || {};
    if (!data) {
      const errorMessage = "process.env.SECRET_KEY is undefined";
      console.log(errorMessage);
      errorLogging(errorMessage, __filename);
      return res.status(500).end();
    } else if (!iv) {
      const errorMessage = "iv is undefined";
      console.log(errorMessage);
      errorLogging(errorMessage, __filename);
      return res.status(500).end();
    }

    try {
      await patchMessage(id, status, data, iv);
      return res.status(200).json({ newToken });
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      return res.status(500).end();
    }
  }
};

export {
  getAllMessagesController,
  getThreeRandomMessagesController,
  postMessageController,
  patchMessageController,
};
