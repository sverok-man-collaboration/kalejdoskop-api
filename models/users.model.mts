import { PrismaClient } from "@prisma/client";
import errorLogging from "../middlewares/error-logging.mjs";

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

async function addUser(email: string, name: string) {
  async function main() {
    await prisma.user.create({
      data: {
        email: email,
        name: name,
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

async function verifyUserEmail(email: string) {
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

async function removeUser(id: number) {
  async function main() {
    const result = await prisma.user.delete({
      where: { id: id },
    });
    console.log(result);
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

export { getAllUsers, addUser, verifyUserEmail, verifyUserId, removeUser };