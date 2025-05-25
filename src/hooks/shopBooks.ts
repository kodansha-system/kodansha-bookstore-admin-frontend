import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { QueryKeys } from "@/constants";
import {
  createShopBook,
  editShopBook,
  getListShopBook,
  getShopBook,
  unActiveShopBook,
} from "@/services/shopBooks";

export const useShopBooks = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.SHOP_BOOKS, filter],
    queryFn: () => getListShopBook(filter),
  });
};

export const useDetailShopBooks = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.SHOP_BOOKS, id],
    queryFn: async () => await getShopBook(id),
  });
  return query;
};

export const useCreateShopBooks = () => {
  const queryClient = useQueryClient();

  const createShopBooksMutation = useMutation({
    mutationFn: createShopBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SHOP_BOOKS] });
      message.success("Tạo mới shopBooks thành công!");
    },
  });

  return createShopBooksMutation;
};

export const useEditShopBooks = () => {
  const queryClient = useQueryClient();

  const editShopBooksMutation = useMutation({
    mutationFn: async (data: any) => await editShopBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SHOP_BOOKS] });
      message.success("Sửa shopBooks thành công!");
    },
  });

  return editShopBooksMutation;
};

export const useUnActiveShopBooks = () => {
  const queryClient = useQueryClient();

  const unActiveShopBooksMutation = useMutation({
    mutationFn: async (id: string) => await unActiveShopBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SHOP_BOOKS] });
      message.success("Ẩn shopBooks thành công!");
    },
  });

  return unActiveShopBooksMutation;
};
