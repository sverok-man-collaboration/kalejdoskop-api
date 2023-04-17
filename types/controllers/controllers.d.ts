interface User {
  id: number;
  email: string;
  name: string;
}

interface Post {
  id: number;
  timestamp: Date;
  room: string;
  object: string;
  message: string;
  status: string;
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

export { User, Post, GameStatistic, Question, Answer, GameDownloaded };
