import { Form, Input, Modal, Select, Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { useCreateUser, useDetailUser, useEditUser } from "@/hooks/users";
import { IUser } from "@/models";
import { Action } from "@/enum/actions";
import { FileType, getBase64 } from "@/utils/file";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: Action;
  id?: string;
}

const UserController = ({ isOpen, setIsOpen, mode, id }: IProps) => {
  const [form] = Form.useForm();
  const createUser = useCreateUser();
  const editUser = useEditUser();
  const { data } = useDetailUser(id || "");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (isOpen && mode === "edit" && data) {
      const user = data?.data;
      form.setFieldsValue(user);
      if (user?.image) {
        setFileList([{ uid: "", name: user?.name, url: user?.image }]);
      }
    }
  }, [isOpen, mode, data, form]);

  const handleSubmit = async (values: IUser) => {
    try {
      await form.validateFields();
      setIsLoading(true);
      const image = fileList[0]?.originFileObj as File | undefined;
      if (mode === Action.ADD) {
        await createUser.mutateAsync({ ...values, image });
      } else if (mode === "edit" && id) {
        await editUser.mutateAsync({ ...values, id: id, image });
      }
      setIsOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setImageError(newFileList.length === 0);
  };

  return (
    <Modal
      open={isOpen}
      title={mode === "add" ? "Thêm môn học" : "Sửa user"}
      okText={mode === "add" ? "Tạo" : "Sửa"}
      cancelText="Hủy"
      onCancel={() => setIsOpen(false)}
      destroyOnClose
      afterClose={() => {
        setIsLoading(false);
        setFileList([]);
        setPreviewImage("");
        setImageError(false);
        form.resetFields();
      }}
      modalRender={(dom) => (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {dom}
        </Form>
      )}
      onOk={() => form.submit()}
      confirmLoading={isLoading}
      maskClosable={false}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={
          mode === Action.ADD
            ? [{ required: true, message: "Email không được để trống" }]
            : []
        }
      >
        <Input disabled={mode === Action.EDIT} />
      </Form.Item>

      <Form.Item
        label="Họ và tên"
        name="name"
        rules={
          mode === Action.ADD
            ? [{ required: true, message: "Họ và tên không được để trống" }]
            : []
        }
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Giới tính"
        rules={
          Action.ADD
            ? [{ required: true, message: "Giới tính không được để trống" }]
            : []
        }
      >
        <Select
          options={[
            { value: "male", label: "Nam" },
            { value: "female", label: "Nữ" },
            { value: "other", label: "Khác" },
          ]}
          placeholder="Chọn giới tính"
        />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={
          mode === Action.ADD
            ? [{ required: true, message: "Mật khẩu không được để trống" }]
            : []
        }
      >
        <Input type="password" />
      </Form.Item>

      <Form.Item
        label="Nhập lại mật khẩu"
        name="confirm_password"
        rules={
          mode === Action.ADD
            ? [
                {
                  required: true,
                  message: "Xác nhận mật khẩu không được để trống",
                },
              ]
            : []
        }
      >
        <Input type="password" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone_number"
        rules={
          mode === Action.ADD
            ? [{ required: true, message: "Số điện thoại không được để trống" }]
            : []
        }
      >
        <Input />
      </Form.Item>

      <Form.Item label="Ảnh đại diện">
        <Upload
          beforeUpload={() => false}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={1}
        >
          {fileList.length >= 1 ? null : (
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          )}
        </Upload>
        {imageError && (
          <div style={{ color: "red", fontSize: 12 }}>
            Vui lòng chọn một ảnh
          </div>
        )}
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Form.Item>
    </Modal>
  );
};

export default UserController;
