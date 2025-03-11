import { ApiPath } from "../enum/api";
import instance from "./apiRequest";

export const getListTest = async (id: string) => {
  return await instance.get(`${ApiPath.TEST_SUBJECT}/${id}`);
};

export const getTest = async (id: string) => {
  return await instance.get(`${ApiPath.TEST}/${id}`);
};

export const createTest = async (data: unknown) => {
  const response = await instance.post(ApiPath.TEST, data);
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const editTest = async (data: any) => {
  const response = await instance.put(`${ApiPath.TEST}/${data?.id}`, data);
  return response.data;
};

export const unActiveTest = async (id: string) => {
  return await instance.delete(`${ApiPath.TEST_SUBJECT}/${id}`);
};
