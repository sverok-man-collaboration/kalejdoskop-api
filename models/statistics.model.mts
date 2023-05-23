import { PrismaClient } from "@prisma/client";
import errorLogging from "../middlewares/error-logging.mjs";

// Types import
import type { GameStatistic } from "../types/controllers/controllers.js";

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

export { getAllGameStatistics, postGameStatistic };
