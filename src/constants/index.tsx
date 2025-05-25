import { IconPlay, IconUser } from "../components/icons";
import { RoutePath } from "../enum/routes";
import { IMenuItems } from "../models";

export const menuItems: IMenuItems[] = [
  {
    url: "/",
    title: "Dashboard",
    icon: <IconPlay className="size-5" />,
  },
  {
    url: RoutePath.USERS,
    title: "Quản lý người dùng",
    icon: <IconUser className="size-5" />,
  },
];

export const QueryKeys = {
  ROLES: "roles",
  ARTICLES: "articles",
  BOOKS: "books",
  REVIEWS: "reviews",
  FLASH_SALES: "flashsales",
  CATEGORY: "category",
  VOUCHERS: "vouchers",
  SHOPS: "shops",
  SHOP_BOOKS: "shopBooks",
  STAFFS: "staffs",
  USERS: "users",
  PROVINCES: "provinces",
  DISTRICTS: "districts",
  WARDS: "wards",
};
