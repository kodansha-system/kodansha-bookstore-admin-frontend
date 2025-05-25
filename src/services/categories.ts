import { ApiPath } from "@/enum/api";
import instance from "./apiRequest";
import { ICategory } from "@/models";

export const getListCategories = async (params: any) => {
  return await instance.get(`/categories`, {
    params,
  });
};

export const getCategory = async (id: string) => {
  return await instance.get(`${ApiPath.CATEGORIES}/${id}`);
};

export const createCategory = async (data: ICategory) => {
  const formData = new FormData();
  formData.append("image", data.image as File);
  formData.append("title", data.title);
  formData.append("content", data.content);

  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.CATEGORIES}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const editCategory = async (data: ICategory) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.CATEGORIES}/${data.id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteCategory = async (id: string) => {
  return await instance.delete(`${ApiPath.CATEGORIES}/${id}`);
};
