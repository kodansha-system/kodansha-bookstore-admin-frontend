import { ApiPath } from "../enum/api";
import { IBanner } from "../models";
import instance from "./apiRequest";

export const getListBanner = async () => {
  return await instance.get(`${ApiPath.BANNERS}`);
};

export const getBanner = async (id: string) => {
  return await instance.get(`${ApiPath.BANNERS}/${id}`);
};

export const createBanner = async (data: IBanner) => {
  const formData = new FormData();
  formData.append("image", data.image as File);
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("book_id", data.book_id);

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

export const editBanner = async (data: IBanner) => {
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

export const unActiveBanner = async (id: string) => {
  return await instance.delete(`${ApiPath.BANNERS}/${id}`);
};
