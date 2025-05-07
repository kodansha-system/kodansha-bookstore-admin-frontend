import instance from "./apiRequest";

export const getListBook = async (params: any) => {
  return await instance.get(`/books`, {
    params,
  });
};
