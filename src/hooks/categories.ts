import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IArticle } from "@/models";
import { message } from "antd";

import { QueryKeys } from "@/constants";
import {
  createArticle,
  editArticle,
  getArticle,
  unActiveArticle,
} from "@/services/articles";
import { getListCategories } from "@/services/categories";

export const useCategories = (filter: any) => {
  return useQuery({
    queryKey: ["categories", filter],
    queryFn: () => getListCategories(filter),
  });
};

export const useDetailArticle = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.ARTICLES, id],
    queryFn: async () => await getArticle(id),
  });
  return query;
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  const createArticleMutation = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ARTICLES] });
      message.success("Tạo mới article thành công!");
    },
  });

  return createArticleMutation;
};

export const useEditArticle = () => {
  const queryClient = useQueryClient();

  const editArticleMutation = useMutation({
    mutationFn: async (data: IArticle) => await editArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ARTICLES] });
      message.success("Sửa article thành công!");
    },
  });

  return editArticleMutation;
};

export const useUnActiveArticle = () => {
  const queryClient = useQueryClient();

  const unActiveArticleMutation = useMutation({
    mutationFn: async (id: string) => await unActiveArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.ARTICLES] });
      message.success("Ẩn article thành công!");
    },
  });

  return unActiveArticleMutation;
};
