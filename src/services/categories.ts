import instance from "./apiRequest";

export const getListCategories = async (params: any) => {
  return await instance.get(`/categories`, {
    params,
  });
};
