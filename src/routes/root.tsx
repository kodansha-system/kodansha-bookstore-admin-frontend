import { Link, NavLink, Outlet } from "react-router-dom";
import { menuItems } from "../constants";
import { IMenuItems } from "../models";
import { RoutePath } from "../enum/routes";

export default function Root() {
  return (
    <div className="flex gap-x-5 h-[100vh]">
      <div className="bg-white dark:bg-greyDarker p-5 border-r border-r-gray-200 dark:border-opacity-10 flex flex-col">
        <Link
          to={RoutePath.DASHBOARD}
          className="font-bold text-3xl inline-block mb-5 text-blue-500"
        >
          Ôn thi CTPL - Admin
        </Link>
        <ul>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              url={item.url}
              icon={item.icon}
              title={item.title}
            ></MenuItem>
          ))}
        </ul>
      </div>
      <div id="detail" className="w-full px-10 py-5">
        <Outlet />
      </div>
    </div>
  );
}

function MenuItem({ url = "/", icon, title }: IMenuItems) {
  return (
    <li>
      <NavLink
        to={url}
        className={({ isActive, isPending, isTransitioning }) =>
          [
            isPending ? "pending" : "",
            isActive
              ? "flex items-center text-base gap-x-3 p-3 my-3 rounded-md bg-blue-500 text-white"
              : "flex items-center text-base gap-x-3 hover:bg-blue-500 hover:bg-opacity-10 p-3 my-3 rounded-md",
            isTransitioning ? "transitioning" : "",
          ].join(" ")
        }
      >
        {icon}
        {title}
      </NavLink>
    </li>
  );
}
