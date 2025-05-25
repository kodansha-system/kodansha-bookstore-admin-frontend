import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { message } from "antd";

import { QueryKeys } from "@/constants";
import { createBook, editBook, getBook, unActiveBook } from "@/services/books";
import { getListBook } from "@/services/books";

export const useBooks = (filter: any) => {
  return useQuery({
    queryKey: ["books", filter],
    queryFn: () => getListBook(filter),
  });
};

export const useDetailBook = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.BOOKS, id],
    queryFn: async () => await getBook(id),
  });
  return query;
};

export const useCreateBook = () => {
  const queryClient = useQueryClient();

  const createBookMutation = useMutation({
    mutationFn: createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKS] });
      message.success("Tạo mới book thành công!");
    },
  });

  return createBookMutation;
};

export const useEditBook = () => {
  const queryClient = useQueryClient();

  const editBookMutation = useMutation({
    mutationFn: async (data: any) => await editBook(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKS] });
      message.success("Sửa book thành công!");
    },
  });

  return editBookMutation;
};

export const useUnActiveBook = () => {
  const queryClient = useQueryClient();

  const unActiveBookMutation = useMutation({
    mutationFn: async (id: string) => await unActiveBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKS] });
      message.success("Ẩn book thành công!");
    },
  });

  return unActiveBookMutation;
};
