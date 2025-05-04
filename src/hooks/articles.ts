import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IArticle } from "@/models";
import { notification } from "antd";

import { QueryKeys } from "@/constants";
import {
  createArticle,
  editArticle,
  getArticle,
  getListArticle,
  unActiveArticle,
} from "@/services/articles";

export const useArticles = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.ARTICLES, filter],
    queryFn: () => getListArticle(filter),
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
      notification.success({ message: "Tạo mới article thành công!" });
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
      notification.success({ message: "Sửa article thành công!" });
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
      notification.success({ message: "Ẩn article thành công!" });
    },
  });

  return unActiveArticleMutation;
};
