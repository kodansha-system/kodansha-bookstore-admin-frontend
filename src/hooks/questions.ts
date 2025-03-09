import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuestion,
  createQuestionsFromFile,
  editQuestion,
  getListQuestion,
  getListQuestionBySubjectId,
  getQuestion,
  unActiveQuestion,
} from "../services/questions";
import { IQuestion } from "../models";
import { notification } from "antd";

export const useQuestions = () => {
  const query = useQuery({ queryKey: ["questions"], queryFn: getListQuestion });
  return query;
};

export const useQuestionsSubject = (id: string) => {
  const query = useQuery({
    queryKey: ["questions_subject", id],
    queryFn: async () => await getListQuestionBySubjectId(id),
  });
  const dataQuestionsOfSubject = query?.data?.data?.data?.questions?.map(
    (item: IQuestion) => {
      return { ...item, key: item?._id };
    }
  );
  return { query, dataQuestionsOfSubject };
};

export const useDetailQuestion = (id: string) => {
  const { data, isSuccess } = useQuery({
    queryKey: ["questions", id],
    queryFn: async () => await getQuestion(id),
  });
  if (isSuccess)
    return {
      data: data?.data?.data?.subject,
    };
  return {
    data,
    isSuccess,
  };
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  const createQuestionMutation = useMutation({
    mutationFn: createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      notification.success({ message: "Tạo mới câu hỏi thành công!" });
    },
  });

  return createQuestionMutation;
};

export const useCreateQuestionFromFile = () => {
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: createQuestionsFromFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      notification.success({ message: "Thêm câu hỏi từ file thành công!" });
    },
  });

  return createUserMutation;
};

export const useEditQuestion = () => {
  const queryClient = useQueryClient();

  const createQuestionMutation = useMutation({
    mutationFn: async (data: IQuestion) => await editQuestion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      notification.success({ message: "Sửa câu hỏi thành công!" });
    },
  });

  return createQuestionMutation;
};

export const useUnActiveQuestion = () => {
  const queryClient = useQueryClient();

  const unActiveQuestionMutation = useMutation({
    mutationFn: async (id: string) => await unActiveQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  return unActiveQuestionMutation;
};
