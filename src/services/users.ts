import { ApiPath } from "../enum/api";
import { IUser } from "../models";
import instance from "./apiRequest";

export const getListUser = async (params: any) => {
  return await instance.get(`${ApiPath.USERS}`, {
    params,
  });
};

export const getUser = async (id: string) => {
  return await instance.get(`${ApiPath.USERS}/${id}`);
};

export const createUser = async (data: IUser) => {
  const response = await instance.post(ApiPath.USERS, data);
  return response.data;
};

export const editUser = async (data: IUser) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, id, _id, ...rest } = data;
  const response = await instance.patch(`${ApiPath.USERS}/${id}`, rest);
  return response.data;
};

export const unActiveUser = async (id: string) => {
  return await instance.delete(`${ApiPath.USERS}/${id}`);
};
