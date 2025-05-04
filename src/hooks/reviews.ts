import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IReview } from "@/models";
import { notification } from "antd";

import { QueryKeys } from "@/constants";
import {
  createReview,
  editReview,
  getListReview,
  getReview,
  unActiveReview,
  verifiedReview,
} from "@/services/reviews";

export const useReviews = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.REVIEWS, filter],
    queryFn: () => getListReview(filter),
  });
};

export const useDetailReview = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.REVIEWS, id],
    queryFn: async () => await getReview(id),
  });
  return query;
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS] });
      notification.success({ message: "Tạo mới review thành công!" });
    },
  });

  return createReviewMutation;
};

export const useVerifiedReview = () => {
  const queryClient = useQueryClient();

  const verifiedReviewMutation = useMutation({
    mutationFn: async (data: IReview) => await verifiedReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS] });
      notification.success({ message: "Cập nhật review thành công!" });
    },
  });

  return verifiedReviewMutation;
};

export const useEditReview = () => {
  const queryClient = useQueryClient();

  const editReviewMutation = useMutation({
    mutationFn: async (data: IReview) => await editReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS] });
      notification.success({ message: "Sửa review thành công!" });
    },
  });

  return editReviewMutation;
};

export const useUnActiveReview = () => {
  const queryClient = useQueryClient();

  const unActiveReviewMutation = useMutation({
    mutationFn: async (id: string) => await unActiveReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.REVIEWS] });
      notification.success({ message: "Ẩn review thành công!" });
    },
  });

  return unActiveReviewMutation;
};
