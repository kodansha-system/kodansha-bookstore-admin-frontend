import {
  IconComment,
  IconExplore,
  IconPlay,
  IconUser,
} from "../components/icons";
import IconBanner from "../components/icons/IconBanner";
import { RoutePath } from "../enum/routes";
import { IMenuItems } from "../models";

export const menuItems: IMenuItems[] = [
  {
    url: "/",
    title: "Dashboard",
    icon: <IconPlay className="size-5" />,
  },
  {
    url: RoutePath.BANNERS,
    title: "Quản lý banners",
    icon: <IconBanner className="size-5" />,
  },
  {
    url: RoutePath.QUESTIONS,
    title: "Quản lý câu hỏi",
    icon: <IconExplore className="size-5" />,
  },
  {
    url: RoutePath.TESTS,
    title: "Quản lý bài test",
    icon: <IconComment className="size-5" />,
  },
  {
    url: RoutePath.USERS,
    title: "Quản lý người dùng",
    icon: <IconUser className="size-5" />,
  },
];

export const QueryKeys = {
  BANNERS: "banners",
};
