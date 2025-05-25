import { Layout, Menu, MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import IconBanner from "@/components/icons/IconBanner";
import { StyledLayout } from "./styled";
import { IconUser } from "@/components/icons";
import { RoutePath } from "@/enum/routes";
import Header from "@/components/layout/Header";
import {
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  FileTextOutlined,
  GiftOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  StarOutlined,
  ThunderboltOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    "Quản lý thống kê",
    "/statistics",
    <BarChartOutlined className="size-[20px]" />
  ),
  getItem(
    "Quản lý người dùng",
    "/users",
    <UserOutlined className="size-[20px]" />
  ),
  getItem(
    "Quản lý bài viết",
    "/articles",
    <FileTextOutlined className="size-[20px]" />
  ),
  getItem(
    "Quản lý đánh giá",
    "/reviews",
    <StarOutlined className="size-[20px]" />
  ),
  getItem(
    "Quản lý danh mục sách",
    "/categories",
    <AppstoreOutlined className="size-[20px]" />
  ),
  getItem("Quản lý sách", "/books", <BookOutlined className="size-[20px]" />),
  getItem(
    "Quản lý đơn hàng",
    "/orders",
    <ShoppingCartOutlined className="size-[20px]" />
  ),
  getItem(
    "Quản lý flash sales",
    RoutePath.FLASH_SALES,
    <ThunderboltOutlined className="size-[20px]" />
  ),
  getItem(
    "Quản lý mã giảm giá",
    "/vouchers",
    <GiftOutlined className="size-[20px]" />
  ),
  getItem(
    "Quản lý cửa hàng",
    "/shops",
    <ShopOutlined className="size-[20px]" />
  ),
  getItem(
    "Quản lý sách tại cửa hàng",
    "/shop-books",
    <BookOutlined className="size-[20px]" />
  ),
  getItem(
    "Quản lý nhân viên",
    "/staffs",
    <UserOutlined className="size-[20px]" />
  ),
];

export default function Root() {
  const navigate = useNavigate();
  return (
    <StyledLayout>
      <Layout style={{ height: "100vh" }}>
        <Sider
          collapsible
          breakpoint="lg"
          collapsedWidth={80}
          width={220}
          style={{ background: "white" }}
        >
          <div className="py-2 text-center">
            <img
              src="/kodansha.png"
              alt="logo"
              className="block lg:hidden mx-auto w-10 h-10"
            />

            <div className="hidden lg:block font-bold text-[21px] bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 bg-clip-text text-transparent">
              Kodansha
            </div>
          </div>

          <Menu
            style={{ background: "white" }}
            theme="light"
            selectedKeys={[location.pathname]}
            mode="inline"
            items={items}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ margin: "16px", overflow: "auto" }}>
            <div
              style={{
                padding: 24,
                minHeight: 360,
                background: "#fff",
                borderRadius: 8,
              }}
            >
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </StyledLayout>
  );
}
