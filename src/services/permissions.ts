import { ApiPath } from "../enum/api";
import { IPermission } from "../models";
import instance from "./apiRequest";

export const getListPermission = async () => {
  return await instance.get(`${ApiPath.BANNERS}`);
};

export const getPermission = async (id: string) => {
  return await instance.get(`${ApiPath.BANNERS}/${id}`);
};

export const createPermission = async (data: IPermission) => {
  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.BANNERS}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const editPermission = async (data: IPermission) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.BANNERS}/${data._id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const unActivePermission = async (id: string) => {
  return await instance.delete(`${ApiPath.BANNERS}/${id}`);
};
