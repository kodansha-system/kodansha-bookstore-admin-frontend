import { ApiPath } from "../enum/api";
import { IArticle } from "../models";
import instance from "./apiRequest";

export const getListArticle = async () => {
  return await instance.get(`${ApiPath.ARTICLES}`);
};

export const getArticle = async (id: string) => {
  return await instance.get(`${ApiPath.ARTICLES}/${id}`);
};

export const createArticle = async (data: IArticle) => {
  const formData = new FormData();
  formData.append("image", data.image as File);
  formData.append("title", data.title);
  formData.append("content", data.content);

  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.ARTICLES}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const editArticle = async (data: IArticle) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.ARTICLES}/${data.id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const unActiveArticle = async (id: string) => {
  return await instance.delete(`${ApiPath.ARTICLES}/${id}`);
};
