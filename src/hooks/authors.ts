import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IAuthor } from "@/models";
import { message } from "antd";

import { QueryKeys } from "@/constants";
import {
  createAuthor,
  deleteAuthor,
  editAuthor,
  getAuthor,
  getListAuthors,
} from "@/services/authors";

export const useAuthors = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.AUTHORS, filter],
    queryFn: () => getListAuthors(filter),
  });
};

export const useDetailAuthor = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.AUTHORS, id],
    queryFn: async () => await getAuthor(id),
  });
  return query;
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  const createAuthorMutation = useMutation({
    mutationFn: createAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AUTHORS] });
      message.success("Tạo mới author thành công!");
    },
  });

  return createAuthorMutation;
};

export const useEditAuthor = () => {
  const queryClient = useQueryClient();

  const editAuthorMutation = useMutation({
    mutationFn: async (data: IAuthor) => await editAuthor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AUTHORS] });
      message.success("Sửa author thành công!");
    },
  });

  return editAuthorMutation;
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();

  const unActiveAuthorMutation = useMutation({
    mutationFn: async (id: string) => await deleteAuthor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.AUTHORS] });
      message.success("Ẩn author thành công!");
    },
  });

  return unActiveAuthorMutation;
};
