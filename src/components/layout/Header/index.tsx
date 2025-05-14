import { LogoutOutlined } from "@ant-design/icons";
import { Button, message, Popconfirm } from "antd";
import Cookies from "js-cookie";

const Header = () => {
  const handleLogout = () => {
    Cookies.remove("access_token");
    window.location.replace("/login");
    message.success("Đã đăng xuất!");
  };

  return (
    <div className="flex justify-end bg-white p-2 border-l items-center space-x-2">
      <div>Admin</div>

      <Popconfirm
        title="Bạn có chắc muốn đăng xuất không?"
        okText="Đăng xuất"
        cancelText="Hủy"
        onConfirm={handleLogout}
      >
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          className="ml-2"
        >
          Đăng xuất
        </Button>
      </Popconfirm>
    </div>
  );
};

export default Header;
