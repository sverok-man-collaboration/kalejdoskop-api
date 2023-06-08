// Model imports
import {
  getAllQuestionsData,
  postQuestionData,
  getAllAnswersData,
  postAnswerData,
} from "../models/statistics.model.mjs";

// Middleware imports
import errorLogging from "../middlewares/error-logging.mjs";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

async function statisticsData() {
  try {
    const questions = await getAllQuestionsData();
    if (questions.length > 0) {
      return;
    }
    const answers = await getAllAnswersData();
    if (answers.length > 0) {
      return;
    }
  } catch (error) {
    console.log(error);
    errorLogging(error, __filename);
    return;
  }
  const questions = [
    { id: 1, question: "question 1", character: "Milou" },
    { id: 2, question: "question 2", character: "Milou" },
    { id: 3, question: "question 3", character: "Milou" },
  ];
  for (const question of questions) {
    try {
      await postQuestionData(
        question.id,
        question.question,
        question.character
      );
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      return;
    }
  }
  const answers = [
    { id: 1, answer: "answer 1", questionId: 1 },
    { id: 2, answer: "answer 2", questionId: 1 },
    { id: 3, answer: "answer 3", questionId: 2 },
    { id: 4, answer: "answer 4", questionId: 2 },
    { id: 5, answer: "answer 5", questionId: 3 },
    { id: 6, answer: "answer 6", questionId: 3 },
  ];
  for (const answer of answers) {
    try {
      await postAnswerData(answer.id, answer.answer, answer.questionId);
    } catch (error) {
      console.log(error);
      errorLogging(error, __filename);
      return;
    }
  }
}

export default statisticsData;
