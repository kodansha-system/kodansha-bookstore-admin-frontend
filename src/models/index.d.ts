import { RcFile } from "antd/es/upload";

export interface IMenuItems {
  url: string;
  icon?: React.ReactNode;
  title: string;
}
export interface ISubject {
  _id: string;
  name: string;
  numberOfCredit: number;
  createdAt: string;
  updatedAt: string;
  status: boolean;
  id: string;
  image: File | RcFile | string;
}

export interface IUser {
  _id: string;
  id: string;
  email: string;
  fullname: string;
  dateOfBirth: string;
  isLocked: boolean;
  avatar: string;
  role: string;
  star: number;
  gender: string;
  image?: File;
  createdAt: string;
  updatedAt: string;
}

export interface IQuestion {
  _id: string;
  id: string;
  subject: string;
  content: string;
  answers: string[];
  correctAnswer: string;
  createdAt: string;
  updatedAt: string;
  test: string;
  ans_1: string;
  ans_2: string;
  ans_3: string;
  ans_4: string;
  key: string;
}

export interface IQuestionCreateParams {
  questionId?: string;
  testId?: string;
  correctAnswer: string;
  content: string;
  answers: string[];
}

export interface IQuestionFile {
  uploadfile: File;
  subjectId: string;
}

export interface ITest {
  name: string;
  duration: number;
  questions: [
    {
      id: string;
      content: string;
      answers: string[];
      correctAnswer: string;
    }
  ];
  subject: string;
  _id: string;
}

export interface ITestCreate {
  name: string;
  duration: number;
  questions: Key[];
  subject: string;
  _id: string;
}

export interface IBanner {
  _id: string;
  name: string;
  description: string;
  image?: File;
  book_id: string;
}
