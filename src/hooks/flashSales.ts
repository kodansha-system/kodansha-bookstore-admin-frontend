import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IFlashSale } from "@/models";
import { message } from "antd";

import { QueryKeys } from "@/constants";
import {
  createFlashSale,
  editFlashSale,
  getFlashSale,
  getListFlashSale,
  unActiveFlashSale,
} from "@/services/flashSales";

export const useFlashSales = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.FLASH_SALES, filter],
    queryFn: () => getListFlashSale(filter),
  });
};

export const useDetailFlashSale = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.FLASH_SALES, id],
    queryFn: async () => await getFlashSale(id),
  });
  return query;
};

export const useCreateFlashSale = () => {
  const queryClient = useQueryClient();

  const createFlashSaleMutation = useMutation({
    mutationFn: createFlashSale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FLASH_SALES] });
      message.success("Tạo mới flash sale thành công!");
    },
    onError: (e) => {
      message.error(e?.message || "Có lỗi xảy ra khi tạo flash sale");
    },
  });

  return createFlashSaleMutation;
};

export const useEditFlashSale = () => {
  const queryClient = useQueryClient();

  const editFlashSaleMutation = useMutation({
    mutationFn: async (data: IFlashSale) => await editFlashSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FLASH_SALES] });
      message.success("Sửa flash sale thành công!");
    },
    onError: (e) => {
      message.error(e?.message || "Có lỗi khi sửa flash sale");
    },
  });

  return editFlashSaleMutation;
};

export const useUnActiveFlashSale = () => {
  const queryClient = useQueryClient();

  const unActiveFlashSaleMutation = useMutation({
    mutationFn: async (id: string) => await unActiveFlashSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.FLASH_SALES] });
      message.success("Ẩn article thành công!");
    },
  });

  return unActiveFlashSaleMutation;
};
