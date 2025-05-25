import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IShop } from "@/models";
import { message } from "antd";

import { QueryKeys } from "@/constants";
import {
  createShop,
  editShop,
  getListShop,
  getShop,
  unActiveShop,
} from "@/services/shops";

export const useShops = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.SHOPS, filter],
    queryFn: () => getListShop(filter),
  });
};

export const useDetailShop = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.SHOPS, id],
    queryFn: async () => await getShop(id),
  });
  return query;
};

export const useCreateShop = () => {
  const queryClient = useQueryClient();

  const createShopMutation = useMutation({
    mutationFn: createShop,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SHOPS] });
      message.success("Tạo mới shop thành công!");
    },
  });

  return createShopMutation;
};

export const useEditShop = () => {
  const queryClient = useQueryClient();

  const editShopMutation = useMutation({
    mutationFn: async (data: IShop) => await editShop(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SHOPS] });
      message.success("Sửa shop thành công!");
    },
  });

  return editShopMutation;
};

export const useUnActiveShop = () => {
  const queryClient = useQueryClient();

  const unActiveShopMutation = useMutation({
    mutationFn: async (id: string) => await unActiveShop(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SHOPS] });
      message.success("Ẩn shop thành công!");
    },
  });

  return unActiveShopMutation;
};
