import { ApiPath } from "@/enum/api";
import instance from "./apiRequest";
import { IBooks } from "@/models";

export const getListBook = async (params: any) => {
  return await instance.get(`/books`, {
    params,
  });
};

export const getBook = async (id: string) => {
  return await instance.get(`${ApiPath.BOOKS}/${id}`);
};

export const createBook = async (data: IBooks) => {
  const formData = new FormData();
  formData.append("image", data.image as File);

  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.BOOKS}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const editBook = async (data: any, id: string) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.BOOKS}/${id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const unActiveBook = async (id: string) => {
  return await instance.delete(`${ApiPath.BOOKS}/${id}`);
};
