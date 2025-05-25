import { ApiPath } from "../enum/api";
import instance from "./apiRequest";

export const getListProvince = async () => {
  return await instance.get(`/addresses${ApiPath.PROVINCES}`);
};

export const getListDistrict = async (params: any) => {
  return await instance.get(`/addresses${ApiPath.DISTRICTS}`, {
    params,
  });
};

export const getListWard = async (params: any) => {
  return await instance.get(`/addresses${ApiPath.WARDS}`, {
    params,
  });
};
