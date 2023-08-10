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
    { id: 1, question: "Hur ska jag göra med Naomi?", character: "Milou" },
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
    { id: 1, answer: "Ge henne en plushie", questionId: 1 },
    { id: 2, answer: "Skicka DM om Digitala Drakar", questionId: 1 },
    { id: 3, answer: "Ingenting", questionId: 1 },
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
