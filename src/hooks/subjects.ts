import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSubject,
  editSubject,
  getListSubject,
  getSubject,
  unActiveSubject,
} from "../services/subjects";
import { ISubject } from "../models";
import { notification } from "antd";

export const useSubjects = () => {
  const query = useQuery({ queryKey: ["subjects"], queryFn: getListSubject });
  return query;
};

export const useDetailSubject = (id: string) => {
  const query = useQuery({
    queryKey: ["subjects", id],
    queryFn: async () => await getSubject(id),
  });
  return query;
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  const createSubjectMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      notification.success({ message: "Tạo mới môn học thành công!" });
    },
  });

  return createSubjectMutation;
};

export const useEditSubject = () => {
  const queryClient = useQueryClient();

  const editSubjectMutation = useMutation({
    mutationFn: async (data: ISubject) => await editSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      notification.success({ message: "Sửa môn học thành công!" });
    },
  });

  return editSubjectMutation;
};

export const useUnActiveSubject = () => {
  const queryClient = useQueryClient();

  const unActiveSubjectMutation = useMutation({
    mutationFn: async (id: string) => await unActiveSubject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
      notification.success({ message: "Ẩn môn học thành công!" });
    },
  });

  return unActiveSubjectMutation;
};
