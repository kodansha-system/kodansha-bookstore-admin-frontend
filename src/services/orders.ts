import { ApiPath } from "../enum/api";
import { IOrder } from "../models";
import instance from "./apiRequest";

export const getListOrder = async (params: any) => {
  return await instance.get(`/orders`, {
    params,
  });
};

export const getOrder = async (id: string) => {
  return await instance.get(`${ApiPath.ORDERS}/${id}`);
};

export const createOrder = async (data: IOrder) => {
  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.ORDERS}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const editOrder = async (data: IOrder) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.ORDERS}/${data.id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const unActiveOrder = async (id: string) => {
  return await instance.delete(`${ApiPath.ORDERS}/${id}`);
};

export const createShipment = async (id: string) => {
  return await instance.post(`${ApiPath.ORDERS}/${id}`);
};
