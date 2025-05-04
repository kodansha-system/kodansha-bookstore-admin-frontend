import { ApiPath } from "../enum/api";
import { IRole } from "../models";
import instance from "./apiRequest";

export const getListRole = async () => {
  return await instance.get(`${ApiPath.ROLES}`);
};

export const getRole = async (id: string) => {
  return await instance.get(`${ApiPath.ROLES}/${id}`);
};

export const createRole = async (data: IRole) => {
  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.ROLES}`,
    data
  );
  return response.data;
};

export const editRole = async (data: IRole) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.ROLES}/${data._id}`,
    data
  );
  return response.data;
};

export const unActiveRole = async (id: string) => {
  return await instance.delete(`${ApiPath.ROLES}/${id}`);
};
