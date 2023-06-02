import { PrismaClient } from "@prisma/client";

// Middleware imports
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// Types import
import type {
  GameStatistic,
  GameDownloaded,
} from "../types/controllers/controllers.js";

const prisma = new PrismaClient();

async function getAllGameStatistics() {
  let gameStatistics: GameStatistic[] | [] = [];
  async function main() {
    gameStatistics = await prisma.gameStatistic.findMany({
      include: {
        answer: {
          include: {
            question: true,
          },
        },
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
  return gameStatistics;
}

async function postGameStatistic(answerId: number) {
  async function main() {
    await prisma.gameStatistic.create({
      data: {
        answerId: answerId,
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

async function getAllDownloadStatistics() {
  let downloadStatistics: GameDownloaded[] | [] = [];
  async function main() {
    downloadStatistics = await prisma.gameDownloaded.findMany();
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
  return downloadStatistics;
}

async function postDownloadStatistic() {
  async function main() {
    await prisma.gameDownloaded.create({
      data: {},
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
  getAllGameStatistics,
  postGameStatistic,
  getAllDownloadStatistics,
  postDownloadStatistic,
};
