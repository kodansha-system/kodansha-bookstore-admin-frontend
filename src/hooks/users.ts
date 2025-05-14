import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createUser,
  editUser,
  getListUser,
  getUser,
  unActiveUser,
} from "../services/users";
import { IUser } from "../models";
import { message } from "antd";
import { error } from "console";

export const useUsers = (filter: any) => {
  const query = useQuery({
    queryKey: ["users", filter],
    queryFn: () => getListUser(filter),
  });
  return query;
};

export const useDetailUser = (id: string) => {
  const query = useQuery({
    queryKey: ["users", id],
    queryFn: async () => await getUser(id),
  });
  return query;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      message.error(error?.message || "Có lỗi xảy ra");
    },
  });

  return createUserMutation;
};

export const useEditUser = () => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (data: IUser) => await editUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      message.error(error?.message || "Có lỗi xảy ra");
    },
  });

  return createUserMutation;
};

export const useUnActiveUser = () => {
  const queryClient = useQueryClient();

  const unActiveUserMutation = useMutation({
    mutationFn: async (id: string) => await unActiveUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      message.success("Khóa tại khoản thành công!");
    },
  });

  return unActiveUserMutation;
};
