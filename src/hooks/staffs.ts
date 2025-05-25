import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createStaff,
  editStaff,
  getListStaff,
  getStaff,
  unActiveStaff,
} from "../services/staffs";
import { IStaff } from "../models";
import { message } from "antd";

export const useStaffs = (filter: any) => {
  const query = useQuery({
    queryKey: ["staffs", filter],
    queryFn: () => getListStaff(filter),
  });
  return query;
};

export const useDetailStaff = (id: string) => {
  const query = useQuery({
    queryKey: ["staffs", id],
    queryFn: async () => await getStaff(id),
  });
  return query;
};

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  const createStaffMutation = useMutation({
    mutationFn: createStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
    },
    onError: (error) => {
      message.error(error?.message || "Có lỗi xảy ra");
    },
  });

  return createStaffMutation;
};

export const useEditStaff = () => {
  const queryClient = useQueryClient();

  const createStaffMutation = useMutation({
    mutationFn: async (data: IStaff) => await editStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
    },
    onError: (error) => {
      message.error(error?.message || "Có lỗi xảy ra");
    },
  });

  return createStaffMutation;
};

export const useUnActiveStaff = () => {
  const queryClient = useQueryClient();

  const unActiveStaffMutation = useMutation({
    mutationFn: async (id: string) => await unActiveStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staffs"] });
      message.success("Khóa tài khoản thành công!");
    },
  });

  return unActiveStaffMutation;
};
