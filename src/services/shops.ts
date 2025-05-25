import { ApiPath } from "../enum/api";
import { IShop } from "../models";
import instance from "./apiRequest";

export const getListShop = async (params: any) => {
  return await instance.get(`${ApiPath.SHOPS}`, {
    params,
  });
};

export const getShop = async (id: string) => {
  return await instance.get(`${ApiPath.SHOPS}/${id}`);
};

export const createShop = async (data: IShop) => {
  const formData = new FormData();
  formData.append("address", data?.address);
  formData.append("ward_id", data?.ward_id);
  formData.append("district_id", data?.district_id);
  formData.append("province_id", data?.province_id);
  formData.append("google_map_url", data?.google_map_url);
  formData.append("phone", data?.phone);
  formData.append("working_time", data?.working_time);
  formData.append("name", data?.name);
  formData.append("description", data?.description);
  formData.append("image", data?.image as File);

  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.SHOPS}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const editShop = async (data: IShop) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.SHOPS}/${data.id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const unActiveShop = async (id: string) => {
  return await instance.delete(`${ApiPath.SHOPS}/${id}`);
};
