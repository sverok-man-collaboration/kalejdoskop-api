interface User {
  id: number;
  email: string;
  name: string;
  iv?: string;
}

interface Message {
  id: number;
  timestamp: Date;
  room: string;
  object: string;
  message: string;
  status: string;
  iv?: string;
}

interface GameStatistic {
  id: number;
  timestamp: Date;
  answerId: number;
}

interface Question {
  id: number;
  question: string;
  character: string;
}

interface Answer {
  id: number;
  answer: string;
  questionId: number;
}

interface GameDownloaded {
  id: number;
  timestamp: Date;
}

export { User, Message, GameStatistic, Question, Answer, GameDownloaded };
