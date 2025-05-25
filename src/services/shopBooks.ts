import { ApiPath } from "../enum/api";
import { IShopBook } from "../models";
import instance from "./apiRequest";

export const getListShopBook = async (params: any) => {
  return await instance.get(`${ApiPath.SHOP_BOOKS}/shop/${params?.shop_id}`);
};

export const getShopBook = async (id: string) => {
  return await instance.get(`${ApiPath.SHOP_BOOKS}/${id}`);
};

export const createShopBook = async (data: IShopBook) => {
  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.SHOP_BOOKS}`,
    data
  );
  return response.data;
};

export const editShopBook = async (data: any) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.SHOP_BOOKS}/${data?.shop_id}`,
    { data: data?.books }
  );
  console.log(response.data);
  return response.data;
};

export const unActiveShopBook = async (id: string) => {
  return await instance.delete(`${ApiPath.SHOP_BOOKS}/${id}`);
};
