import instance from "@/services/apiRequest";
import { useQuery } from "@tanstack/react-query";

export const useTopBooks = (from: string, to: string) => {
  return useQuery({
    queryKey: ["top-books", from, to],
    queryFn: async () => {
      const res = await instance.get("/statistics/top-books", {
        params: { from, to },
      });
      return res.data;
    },
  });
};

export const useTopCustomers = (from: string, to: string) => {
  return useQuery({
    queryKey: ["top-customers", from, to],
    queryFn: async () => {
      const res = await instance.get("/statistics/top-customers", {
        params: { from, to },
      });
      return res.data;
    },
  });
};
