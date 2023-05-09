import { PrismaClient } from "@prisma/client";
import errorLogging from "../middlewares/error-logging.mjs";

// Types import
import type { Message } from "../types/controllers/controllers.js";

const prisma = new PrismaClient();

async function getAllMessages() {
  let messages: Message[] | [] = [];
  async function main() {
    messages =
      await prisma.$queryRaw`SELECT * FROM "Message" ORDER BY CASE WHEN status = 'pending' THEN 1 WHEN status = 'approved' THEN 2 WHEN status = 'denied' THEN 3 END`;
  }

  await main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      errorLogging(error, __filename);
      await prisma.$disconnect();
      process.exit(1);
    });
  return messages;
}

async function getThreeRandomMessages(room: string, object: string) {
  let messages: Message[] | [] = [];
  async function main() {
    messages =
      await prisma.$queryRaw`SELECT * FROM "Message" WHERE status = 'approved' AND room = ${room} AND object = ${object} ORDER BY RANDOM() LIMIT 3`;
  }

  await main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      errorLogging(error, __filename);
      await prisma.$disconnect();
      process.exit(1);
    });
  return messages;
}

async function addMessage(room: string, object: string, message: string) {
  async function main() {
    await prisma.message.create({
      data: {
        room: room,
        object: object,
        message: message,
      },
    });
  }

  await main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      errorLogging(error, __filename);
      await prisma.$disconnect();
      process.exit(1);
    });
}

async function getMessage(id: number) {
  let message: Message[] | [] = [];
  async function main() {
    const result = await prisma.message.findUnique({
      where: {
        id: id,
      },
    });
    message = result ? [result] : [];
  }

  await main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      errorLogging(error, __filename);
      await prisma.$disconnect();
      process.exit(1);
    });
  return message;
}

async function updateMessage(id: number, status: string) {
  async function main() {
    await prisma.message.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
  }

  await main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (error) => {
      console.error(error);
      errorLogging(error, __filename);
      await prisma.$disconnect();
      process.exit(1);
    });
}

export {
  getAllMessages,
  getThreeRandomMessages,
  addMessage,
  getMessage,
  updateMessage,
};
