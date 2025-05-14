import instance from "@/services/apiRequest";
import { Form, Input, Button, message } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const { username, password } = values;
    try {
      const res = await instance.post("/auth/login-staff", {
        username,
        password,
      });
      Cookies.set("access_token", res?.data?.access_token);
      message.success("Đăng nhập thành công!");
      navigate("/statistics");
    } catch (error) {
      message.error("Đăng nhập thất bại!");
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Kodansha
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Đăng nhập trang quản trị
            </h1>

            <Form
              name="loginForm"
              layout="vertical"
              onFinish={onFinish}
              className="space-y-4 md:space-y-6"
            >
              <Form.Item
                label="Email"
                name="username"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}
              >
                <Input
                  type="email"
                  placeholder="name@company.com"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Quên mật khẩu? Liên hệ với admin để được khôi phục
              </p>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
