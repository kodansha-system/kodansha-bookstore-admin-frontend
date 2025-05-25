import { ApiPath } from "../enum/api";
import { IStaff } from "../models";
import instance from "./apiRequest";

export const getListStaff = async (params: any) => {
  return await instance.get(`${ApiPath.STAFFS}`, {
    params,
  });
};

export const getStaff = async (id: string) => {
  return await instance.get(`${ApiPath.STAFFS}/${id}`);
};

export const createStaff = async (data: IStaff) => {
  const response = await instance.post(ApiPath.STAFFS, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const editStaff = async (data: IStaff) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, id, _id, ...rest } = data;
  const response = await instance.patch(`${ApiPath.STAFFS}/${id}`, rest, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const unActiveStaff = async (id: string) => {
  return await instance.delete(`${ApiPath.STAFFS}/${id}`);
};
