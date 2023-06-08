import { PrismaClient } from "@prisma/client";

// Middleware imports
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

// Types import
import type {
  GameStatistic,
  GameDownloaded,
  Question,
  Answer,
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

async function getAllQuestionsData() {
  let questionsData: Question[] | [] = [];
  async function main() {
    questionsData = await prisma.question.findMany();
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
  return questionsData;
}

async function postQuestionData(
  id: number,
  question: string,
  character: string
) {
  async function main() {
    await prisma.question.create({
      data: {
        id: id,
        question: question,
        character: character,
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

async function getAllAnswersData() {
  let answersData: Answer[] | [] = [];
  async function main() {
    answersData = await prisma.answer.findMany();
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
  return answersData;
}

async function postAnswerData(id: number, answer: string, questionId: number) {
  async function main() {
    await prisma.answer.create({
      data: {
        id: id,
        answer: answer,
        questionId: questionId,
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
  getAllGameStatistics,
  postGameStatistic,
  getAllDownloadStatistics,
  postDownloadStatistic,
  getAllQuestionsData,
  postQuestionData,
  getAllAnswersData,
  postAnswerData,
};
