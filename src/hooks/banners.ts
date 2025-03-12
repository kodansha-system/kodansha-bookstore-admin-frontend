import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IBanner } from "@/models";
import { notification } from "antd";
import {
  createBanner,
  editBanner,
  getBanner,
  getListBanner,
  unActiveBanner,
} from "@/services/banners";
import { QueryKeys } from "@/constants";

export const useBanners = () => {
  const query = useQuery({
    queryKey: [QueryKeys.BANNERS],
    queryFn: getListBanner,
  });
  return query;
};

export const useDetailBanner = (id: string) => {
  const query = useQuery({
    queryKey: [QueryKeys.BANNERS, id],
    queryFn: async () => await getBanner(id),
  });
  return query;
};

export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  const createBannerMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BANNERS] });
      notification.success({ message: "Tạo mới banner thành công!" });
    },
  });

  return createBannerMutation;
};

export const useEditBanner = () => {
  const queryClient = useQueryClient();

  const editBannerMutation = useMutation({
    mutationFn: async (data: IBanner) => await editBanner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BANNERS] });
      notification.success({ message: "Sửa banner thành công!" });
    },
  });

  return editBannerMutation;
};

export const useUnActiveBanner = () => {
  const queryClient = useQueryClient();

  const unActiveBannerMutation = useMutation({
    mutationFn: async (id: string) => await unActiveBanner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BANNERS] });
      notification.success({ message: "Ẩn banner thành công!" });
    },
  });

  return unActiveBannerMutation;
};
