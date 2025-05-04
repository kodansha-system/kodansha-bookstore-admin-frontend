import { ApiPath } from "../enum/api";
import { IReview } from "../models";
import instance from "./apiRequest";

export const getListReview = async (params: any) => {
  return await instance.get(`/reviews`, {
    params,
  });
};

export const getReview = async (id: string) => {
  return await instance.get(`${ApiPath.REVIEWS}/${id}`);
};

export const verifiedReview = async (data: IReview) => {
  console.log(data);
  return await instance.patch(`${ApiPath.REVIEWS}/${data.id}/verify`, {
    is_verified: data?.is_verified,
  });
};

export const createReview = async (data: IReview) => {
  const formData = new FormData();
  formData.append("image", data.image as File);
  formData.append("rating", String(data.rating));
  formData.append("content", data.content);

  const response = await instance.post(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.REVIEWS}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const editReview = async (data: IReview) => {
  const response = await instance.patch(
    `${import.meta.env.VITE_BACKEND_URL}${ApiPath.REVIEWS}/${data.id}`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const unActiveReview = async (id: string) => {
  return await instance.delete(`${ApiPath.REVIEWS}/${id}`);
};
