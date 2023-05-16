// Model imports
import {
  getAllMessages,
  getThreeRandomMessages,
  addMessage,
  updateMessage,
  updateStatus,
  getMessage,
} from "../models/messages.model.mjs";

// Middleware imports
import newTokenResponse from "../middlewares/new-token.mjs";
import errorLogging from "../middlewares/error-logging.mjs";

// Type imports
import type { Request, Response } from "express";

// Get all messages method
const allMessages = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"]?.toString();

  // Token has already been verified by authenticate-token middleware
  const token = authHeader?.split(" ")[1] as string;
  const newToken = newTokenResponse(token, res);

  if (!newToken) {
    return;
  }

  try {
    const messages = await getAllMessages();
    res.status(200).json({ newToken, messages });
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Get message method
const retrieveMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const authHeader = req.headers["authorization"]?.toString();

  // Token has already been verified by authenticate-token middleware
  const token = authHeader?.split(" ")[1] as string;
  const newToken = newTokenResponse(token, res);

  if (!newToken) {
    return;
  }

  if (id) {
    const idNumber = parseInt(id);
    try {
      const messages = await getMessage(idNumber);
      res.status(200).json({ newToken, messages });
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }
  } else {
    res.status(400).end();
  }
};

// Get three random messages method
const threeRandomMessages = async (req: Request, res: Response) => {
  const { room, object } = req.params;
  if (room && object) {
    try {
      const data = await getThreeRandomMessages(room, object);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }
  } else {
    res.status(400).end();
  }
};

// Post message method
const postMessage = async (req: Request, res: Response) => {
  const { room, object, message } = req.body;
  const roomType = typeof room;
  const objectType = typeof object;
  const messageType = typeof message;

  if (
    roomType === "string" &&
    objectType === "string" &&
    messageType === "string"
  ) {
    try {
      await addMessage(room, object, message);
      res.status(204).end();
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      res.status(500).end();
    }
  } else {
    res.status(400).end();
  }
};

// Patch message method
const patchMessage = async (req: Request, res: Response) => {
  const { id, status, message } = req.body;
  const authHeader = req.headers["authorization"]?.toString();

  // Token has already been verified by authenticate-token middleware
  const token = authHeader?.split(" ")[1] as string;
  const newToken = newTokenResponse(token, res);

  if (!newToken) {
    return;
  }

  const idType = typeof id;
  const statusType = typeof status;
  const messageType = typeof message;

  if (
    idType === "number" &&
    statusType === "string" &&
    messageType === "string"
  ) {
    if (message === "") {
      try {
        await updateStatus(id, status);
        res.status(204).end();
      } catch (error) {
        console.log(error);
        errorLogging(error, __filename);
        res.status(500).end();
      }
    } else {
      try {
        await updateMessage(id, status, message);
        res.status(204).json({ newToken });
      } catch (error) {
        console.log(error);
        errorLogging(error, __filename);
        res.status(500).end();
      }
    }
  } else {
    res.status(400).end();
  }
};

export {
  allMessages,
  retrieveMessage,
  threeRandomMessages,
  postMessage,
  patchMessage,
};
