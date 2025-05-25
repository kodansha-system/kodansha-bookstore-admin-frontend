import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ICategory } from "@/models";
import { message } from "antd";

import { QueryKeys } from "@/constants";

import {
  createCategory,
  deleteCategory,
  editCategory,
  getCategory,
  getListCategories,
} from "@/services/categories";

export const useCategories = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.CATEGORY, filter],
    queryFn: () => getListCategories(filter),
  });
};

export const useDetailCategory = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.CATEGORY, id],
    queryFn: async () => await getCategory(id),
  });
  return query;
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORY] });
      message.success("Tạo mới category thành công!");
    },
  });

  return createCategoryMutation;
};

export const useEditCategory = () => {
  const queryClient = useQueryClient();

  const editCategoryMutation = useMutation({
    mutationFn: async (data: ICategory) => await editCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORY] });
      message.success("Sửa category thành công!");
    },
  });

  return editCategoryMutation;
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const unActiveCategoryMutation = useMutation({
    mutationFn: async (id: string) => await deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CATEGORY] });
      message.success("Ẩn category thành công!");
    },
  });

  return unActiveCategoryMutation;
};
