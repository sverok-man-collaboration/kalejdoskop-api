import type { Request, Response } from "express";
import errorLogging from "../middlewares/error-logging.mjs";

// Model imports
import {
  getAllPosts,
  getThreeRandomPosts,
  addPost,
  updatePost,
  getPost,
} from "../models/messages.model.mjs";

// Get all messages method
const allMessages = async (_req: Request, res: Response) => {
  try {
    const data = await getAllPosts();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Get message method
const getMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (id) {
    const idNumber = parseInt(id);
    try {
      const data = await getPost(idNumber);
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

// Get three random messages method
const threeRandomMessages = async (_req: Request, res: Response) => {
  try {
    const data = await getThreeRandomPosts();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    res.status(500).end();
  }
};

// Post message method
const postMessage = async (req: Request, res: Response) => {
  const { room, object, message } = req.body;
  const roomType = typeof room;
  const objectType = typeof object;
  const messageType = typeof message;

  if (
    messageType === "string" &&
    roomType === "string" &&
    objectType === "string"
  ) {
    try {
      await addPost(room, object, message);
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
  const { id, status } = req.body;
  const idType = typeof id;
  const statusType = typeof status;

  if (idType === "number" && statusType === "string") {
    try {
      await updatePost(id, status);
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

export {
  allMessages,
  getMessage,
  threeRandomMessages,
  postMessage,
  patchMessage,
};
