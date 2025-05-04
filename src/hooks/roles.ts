import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IRole } from "@/models";
import { notification } from "antd";
import {
  createRole,
  editRole,
  getRole,
  getListRole,
  unActiveRole,
} from "@/services/roles";
import { QueryKeys } from "@/constants";

export const useRoles = () => {
  const query = useQuery({
    queryKey: [QueryKeys.ROLES],
    queryFn: getListRole,
  });
  return query;
};

export const useDetailRole = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.ROLES, id],
    queryFn: async () => await getRole(id),
  });
  return query;
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  const createRoleMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ROLES] });
      notification.success({ message: "Tạo mới role thành công!" });
    },
  });

  return createRoleMutation;
};

export const useEditRole = () => {
  const queryClient = useQueryClient();

  const editRoleMutation = useMutation({
    mutationFn: async (data: IRole) => await editRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ROLES] });
      notification.success({ message: "Sửa role thành công!" });
    },
  });

  return editRoleMutation;
};

export const useUnActiveRole = () => {
  const queryClient = useQueryClient();

  const unActiveRoleMutation = useMutation({
    mutationFn: async (id: string) => await unActiveRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ROLES] });
      notification.success({ message: "Ẩn role thành công!" });
    },
  });

  return unActiveRoleMutation;
};
