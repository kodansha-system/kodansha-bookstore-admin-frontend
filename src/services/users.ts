import { ApiPath } from "../enum/api";
import { IUser } from "../models";
import instance from "./apiRequest";

export const getListUser = async () => {
  return await instance.get(`${ApiPath.USERS}`);
};

export const getUser = async (id: string) => {
  return await instance.get(`${ApiPath.USERS}/${id}`);
};

export const createUser = async (data: IUser) => {
  const response = await instance.post(ApiPath.USERS, data);
  return response.data;
};

export const editUser = async (data: IUser) => {
  const { email, id, _id, ...rest } = data;
  console.log(email, _id);
  const response = await instance.put(`${ApiPath.USERS}/${id}`, rest);
  return response.data;
};

export const unActiveUser = async (id: string) => {
  return await instance.delete(`${ApiPath.USERS}/${id}`);
};
