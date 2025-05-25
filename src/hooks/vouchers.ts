import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IVoucher } from "@/models";
import { message } from "antd";

import { QueryKeys } from "@/constants";
import {
  createVoucher,
  editVoucher,
  getListVoucher,
  getVoucher,
  unActiveVoucher,
} from "@/services/vouchers";

export const useVouchers = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.VOUCHERS, filter],
    queryFn: () => getListVoucher(filter),
  });
};

export const useDetailVoucher = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.VOUCHERS, id],
    queryFn: async () => await getVoucher(id),
  });
  return query;
};

export const useCreateVoucher = () => {
  const queryClient = useQueryClient();

  const createVoucherMutation = useMutation({
    mutationFn: createVoucher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.VOUCHERS] });
      message.success("Tạo mới voucher thành công!");
    },
  });

  return createVoucherMutation;
};

export const useEditVoucher = () => {
  const queryClient = useQueryClient();

  const editVoucherMutation = useMutation({
    mutationFn: async (data: IVoucher) => await editVoucher(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.VOUCHERS] });
      message.success("Sửa voucher thành công!");
    },
  });

  return editVoucherMutation;
};

export const useUnActiveVoucher = () => {
  const queryClient = useQueryClient();

  const unActiveVoucherMutation = useMutation({
    mutationFn: async (id: string) => await unActiveVoucher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.VOUCHERS] });
      message.success("Ẩn voucher thành công!");
    },
  });

  return unActiveVoucherMutation;
};
