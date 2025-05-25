import { useQuery } from "@tanstack/react-query";

import { QueryKeys } from "@/constants";
import {
  getListDistrict,
  getListProvince,
  getListWard,
} from "@/services/addresses";

export const useProvinces = () => {
  return useQuery({
    queryKey: [QueryKeys.PROVINCES],
    queryFn: () => getListProvince(),
    select: (data) =>
      data.data?.data?.map((item: any) => {
        return { label: item?.name, value: item?.id };
      }),
  });
};

export const useDistricts = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.DISTRICTS, filter],
    queryFn: () => getListDistrict(filter),
    select: (data) =>
      data.data?.data?.map((item: any) => {
        return { label: item?.name, value: item?.id };
      }),
  });
};

export const useWards = (filter: any) => {
  return useQuery({
    queryKey: [QueryKeys.WARDS, filter],
    queryFn: () => getListWard(filter),
    select: (data) =>
      data.data?.data?.map((item: any) => {
        return { label: item?.name, value: item?.id };
      }),
  });
};
