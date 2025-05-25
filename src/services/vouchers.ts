import { ApiPath } from "../enum/api";
import { IVoucher } from "../models";
import instance from "./apiRequest";

export const getListVoucher = async (params: any) => {
  return await instance.get(`/vouchers`, {
    params,
  });
};

export const getVoucher = async (id: string) => {
  return await instance.get(`${ApiPath.VOUCHERS}/${id}`);
};

export const createVoucher = async (data: IVoucher) => {
  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.VOUCHERS}`,
    data
  );
  return response.data;
};

export const editVoucher = async (data: IVoucher) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.VOUCHERS}/${data.id}`,
    data
  );
  return response.data;
};

export const unActiveVoucher = async (id: string) => {
  return await instance.delete(`${ApiPath.VOUCHERS}/${id}`);
};
