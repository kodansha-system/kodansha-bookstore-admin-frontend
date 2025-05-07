import { createShipment, editOrder, unActiveOrder } from "./../services/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IOrder } from "@/models";
import { message } from "antd";

import { QueryKeys } from "@/constants";
import { createOrder, getListOrder, getOrder } from "@/services/orders";

export const useOrders = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.REVIEWS, filter],
    queryFn: () => getListOrder(filter),
  });
};

export const useDetailOrder = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.REVIEWS, id],
    queryFn: async () => await getOrder(id),
  });
  return query;
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS] });
      message.success("Tạo mới order thành công!");
    },
  });

  return createOrderMutation;
};

export const useVerifiedOrder = () => {
  const queryClient = useQueryClient();

  const verifiedOrderMutation = useMutation({
    mutationFn: async (data: IOrder) => await createShipment(data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS] });
      message.success("Cập nhật order thành công!");
    },
  });

  return verifiedOrderMutation;
};

export const useEditOrder = () => {
  const queryClient = useQueryClient();

  const editOrderMutation = useMutation({
    mutationFn: async (data: IOrder) => await editOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS] });
      message.success("Sửa order thành công!");
    },
  });

  return editOrderMutation;
};

export const useUnActiveOrder = () => {
  const queryClient = useQueryClient();

  const unActiveOrderMutation = useMutation({
    mutationFn: async (id: string) => await unActiveOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS] });
      message.success("Ẩn order thành công!");
    },
  });

  return unActiveOrderMutation;
};
