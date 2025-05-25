import { ApiPath } from "@/enum/api";
import instance from "./apiRequest";
import { IAuthor } from "@/models";

export const getListAuthors = async (params: any) => {
  return await instance.get(`/authors`, {
    params,
  });
};

export const getAuthor = async (id: string) => {
  return await instance.get(`${ApiPath.AUTHORS}/${id}`);
};

export const createAuthor = async (data: IAuthor) => {
  const formData = new FormData();
  formData.append("image", data.image as File);
  formData.append("name", data.name);

  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.AUTHORS}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const editAuthor = async (data: IAuthor) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.AUTHORS}/${data.id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteAuthor = async (id: string) => {
  return await instance.delete(`${ApiPath.AUTHORS}/${id}`);
};
