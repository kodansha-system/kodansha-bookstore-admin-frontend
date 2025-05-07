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
  id: string;
  name: string;
  description: string;
  image?: File;
  book_id: string;
}

export interface IRole {
  _id: string;
  name: string;
  permissions: string[];
}

export interface IPermission {
  _id: string;
  name: string;
  api_path: string;
  method: string;
  module: string;
}

export interface IArticle {
  id: string;
  _id: string;
  title: string;
  content: string;
  image?: File;
}

export interface IReview {
  id: string;
  _id: string;
  content: string;
  rating: number;
  image?: File;
  is_verified: boolean;
}

interface IOrder {
  user_id: {
    name: string;
  };
  shop_id: {
    address: string;
  };
  address: {
    name: string;
    phone: string;
    detail: string;
  };
  total_price: number;
  discount: number;
  total_to_pay: number;
  carrier: {
    id: string;
    name: string;
    fee: number;
    order_code: OrderStatus;
  };
  tracking_order: { status: number; time: Date }[];
  books: {
    book_id: {
      name: string;
      price: number;
      images: string[];
      rating_average: number;
      id: string;
    };
    quantity: number;
    price: number;
    id: string;
    is_deleted: boolean;
    deleted_at: any;
  }[];
  order_status: number;
  vouchers: string[];
  payment_method: string;
  payment_status: PaymentStatus;
  note: string;
  delivery_address: any;
  created_by: any;
  id: string;
  is_deleted: boolean;
  deleted_at: any;
  created_at: string;
  updated_at: string;
  shop_pickup_expire_at: string;
  payment_expire_at: string;
}

interface DetailOrderPageProps {
  params: {
    id: string;
  };
}

export interface IFlashSale {
  id: string;
  name: string;
  start_time: Date;
  end_time: Date;
  books: any;
}
