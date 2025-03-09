import axios from "axios";
import { ApiPath } from "../enum/api";
import { ISubject } from "../models";
import instance from "./apiRequest";

export const getListSubject = async () => {
  return await instance.get(`${ApiPath.ADMIN}${ApiPath.SUBJECTS}`);
};

export const getSubject = async (id: string) => {
  return await instance.get(`${ApiPath.SUBJECTS}/${id}`);
};

export const createSubject = async (data: ISubject) => {
  const formData = new FormData();
  console.log(data.image, "image");
  formData.append("image", data.image as File);
  formData.append("name", data.name);
  formData.append("numberOfCredit", data.numberOfCredit.toString());
  formData.append("status", data?.status?.toString() || "true");

  const response = await axios({
    method: "post",
    url: `${import.meta.env.VITE_BACKEND_URL}${ApiPath.SUBJECTS}`,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const editSubject = async (data: ISubject) => {
  const response = await axios({
    method: "put",
    url: `${import.meta.env.VITE_BACKEND_URL}${ApiPath.SUBJECTS}/${data?.id}`,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const unActiveSubject = async (id: string) => {
  return await instance.delete(`${ApiPath.ADMIN}${ApiPath.SUBJECTS}/${id}`);
};
