import { ApiPath } from "../enum/api";
import { IFlashSale } from "../models";
import instance from "./apiRequest";

export const getListFlashSale = async (params: any) => {
  return await instance.get(ApiPath.FLASH_SALES, {
    params,
  });
};

export const getFlashSale = async (id: string) => {
  return await instance.get(`${ApiPath.FLASH_SALES}/${id}`);
};

export const createFlashSale = async (data: IFlashSale) => {
  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.FLASH_SALES}`,
    data
  );
  return response.data;
};

export const editFlashSale = async (data: IFlashSale) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.FLASH_SALES}/${data.id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const unActiveFlashSale = async (id: string) => {
  return await instance.delete(`${ApiPath.FLASH_SALES}/${id}`);
};
