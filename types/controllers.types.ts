interface Answer {
  id: number;
  question: string;
  answer: boolean;
}

interface Message {
  id: number;
  message: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

interface Database {
  statistics: {
    question1: Answer[];
  };
  posts: {
    question1: Message[];
  };
  users: {
    admin: User[];
  };
}

export { Database };
