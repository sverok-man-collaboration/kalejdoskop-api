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

async function postMessage(
  room: string,
  object: string,
  message: string,
  iv: string
) {
  async function main() {
    await prisma.message.create({
      data: {
        room: room,
        object: object,
        message: message,
        iv: iv,
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

async function patchMessage(id: number, status: string, message: string) {
  async function main() {
    await prisma.message.update({
      where: {
        id: id,
      },
      data: {
        status: status,
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

async function patchStatus(id: number, status: string) {
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
  postMessage,
  patchMessage,
  patchStatus,
};
