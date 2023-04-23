import { PrismaClient } from "@prisma/client";
import errorLogging from "../middlewares/error-logging.mjs";

// Types import
import type { Post } from "../types/controllers/controllers.js";

const prisma = new PrismaClient();

async function getAllPosts() {
  let posts: Post[] | [] = [];
  async function main() {
    posts =
      await prisma.$queryRaw`SELECT * FROM "Post" ORDER BY CASE WHEN status = 'pending' THEN 1 WHEN status = 'approved' THEN 2 WHEN status = 'denied' THEN 3 END`;
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
  return posts;
}

async function getThreeRandomPosts() {
  let posts: Post[] | [] = [];
  async function main() {
    posts =
      await prisma.$queryRaw`SELECT * FROM "Post" ORDER BY RANDOM() LIMIT 3`;
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
  return posts;
}

async function addPost(room: string, object: string, message: string) {
  async function main() {
    await prisma.post.create({
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

async function getPost(id: number) {
  let post: Post[] | [] = [];
  async function main() {
    const result = await prisma.post.findUnique({
      where: {
        id: id,
      },
    });
    post = result ? [result] : [];
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
  return post;
}

async function updatePost(id: number, status: string) {
  async function main() {
    await prisma.post.update({
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

export { getAllPosts, getThreeRandomPosts, addPost, getPost, updatePost };
