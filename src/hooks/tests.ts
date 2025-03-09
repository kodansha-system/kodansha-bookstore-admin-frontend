import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTest,
  editTest,
  getListTest,
  getTest,
  unActiveTest,
} from "../services/tests";
import { notification } from "antd";

export const useTests = (id: string) => {
  const query = useQuery({
    queryKey: ["tests"],
    queryFn: () => getListTest(id),
  });
  return query;
};

export const useDetailTest = (id: string) => {
  const query = useQuery({
    queryKey: ["tests", id],
    queryFn: async () => await getTest(id),
  });
  return query;
};

export const useCreateTest = () => {
  const queryClient = useQueryClient();

  const createTestMutation = useMutation({
    mutationFn: createTest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      notification.success({ message: "Tạo mới bài test thành công!" });
    },
  });

  return createTestMutation;
};

export const useEditTest = () => {
  const queryClient = useQueryClient();

  const createTestMutation = useMutation({
    mutationFn: async (data: unknown) => await editTest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      notification.success({ message: "Sửa bài test thành công!" });
    },
  });

  return createTestMutation;
};

export const useUnActiveTest = () => {
  const queryClient = useQueryClient();

  const unActiveTestMutation = useMutation({
    mutationFn: async (id: string) => await unActiveTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tests"] });
    },
  });

  return unActiveTestMutation;
};
