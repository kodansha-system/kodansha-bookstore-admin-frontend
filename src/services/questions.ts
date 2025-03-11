import axios from "axios";
import { ApiPath } from "../enum/api";
import { IQuestion, IQuestionCreateParams, IQuestionFile } from "../models";
import instance from "./apiRequest";

export const getListQuestion = async () => {
  return await instance.get(`${ApiPath.QUESTIONS}`);
};

export const getListQuestionBySubjectId = async (id: string) => {
  return await instance.get(`${ApiPath.QUESTIONS}/subject/${id}`);
};

export const getQuestion = async (id: string) => {
  return await instance.get(`${ApiPath.QUESTIONS}/${id}`);
};

export const createQuestion = async (data: IQuestionCreateParams) => {
  const response = await instance.post(ApiPath.QUESTIONS, data);
  return response.data;
};

export const createQuestionsFromFile = async (data: IQuestionFile) => {
  const formData = new FormData();
  formData.append("uploadfile", data.uploadfile as File);

  const response = await axios({
    method: "post",
    url: `${import.meta.env.VITE_BACKEND_URL}${
      ApiPath.QUESTIONS
    }/uploadExcelFile/${data?.subjectId}`,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const editQuestion = async (data: IQuestion) => {
  const response = await instance.put(`${ApiPath.QUESTIONS}/${data?.id}`, data);
  return response.data;
};

export const unActiveQuestion = async (id: string) => {
  return await instance.delete(`${ApiPath.QUESTIONS}/${id}`);
};
