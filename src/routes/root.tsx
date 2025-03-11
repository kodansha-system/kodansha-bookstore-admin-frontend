import { Layout, Menu, Breadcrumb, MenuProps } from "antd";
import { Outlet } from "react-router-dom";
import IconBanner from "../components/icons/IconBanner";
import { StyledLayout } from "./styled";

const { Header, Content, Sider } = Layout;

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
  getItem("Quản lý banner", "1", <IconBanner className="size-[20px]" />),
];

export default function Root() {
  return (
    <StyledLayout>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible style={{ background: "white" }}>
          <div className="py-2 font-bold text-[21px] text-center bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
            Shelfly
          </div>
          <Menu
            style={{ background: "white" }}
            theme="light"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
          />
        </Sider>
        <Layout>
          <Content style={{ margin: "16px" }}>
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
