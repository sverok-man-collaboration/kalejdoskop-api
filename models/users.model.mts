import { PrismaClient } from "@prisma/client";

// Middleware imports
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// Types import
import type { User } from "../types/controllers/controllers.js";

const prisma = new PrismaClient();

async function getAllUsers() {
  let users: User[] | [] = [];
  async function main() {
    users = await prisma.user.findMany();
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
  return users;
}

async function postUser(email: string, name: string, iv: string) {
  async function main() {
    await prisma.user.create({
      data: {
        email: email,
        name: name,
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

async function getUser(email: string) {
  let user: User[] | [] = [];
  async function main() {
    const result = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    user = result ? [result] : [];
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
  return user;
}

async function verifyUserId(id: number) {
  let user: User[] | [] = [];
  async function main() {
    const result = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    user = result ? [result] : [];
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
  return user;
}

async function deleteUser(id: number) {
  async function main() {
    await prisma.user.delete({
      where: { id: id },
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

export { getAllUsers, postUser, getUser, verifyUserId, deleteUser };
