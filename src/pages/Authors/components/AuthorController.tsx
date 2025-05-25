import { Form, Input, Modal, Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import {
  useCreateAuthor,
  useDetailAuthor,
  useEditAuthor,
} from "@/hooks/authors";
import { IAuthor } from "@/models";
import { Action } from "@/enum/actions";
import { FileType, getBase64 } from "@/utils/file";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "add" | "edit";
  id?: string;
}

const AuthorController = ({ isOpen, setIsOpen, mode, id }: IProps) => {
  const [form] = Form.useForm();
  const createAuthor = useCreateAuthor();
  const editAuthor = useEditAuthor();
  const { data } = useDetailAuthor(id || "");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = async (values: IAuthor) => {
    try {
      await form.validateFields();
      if (fileList.length === 0) {
        setImageError(true);
        return;
      } else {
        setImageError(false);
      }

      setIsLoading(true);
      const image = fileList[0]?.originFileObj as File | undefined;

      if (mode === Action.ADD) {
        await createAuthor.mutateAsync({ ...values, image });
      } else if (mode === "edit" && id) {
        await editAuthor.mutateAsync({ ...values, id, image });
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

  useEffect(() => {
    if (isOpen && mode === "edit" && data) {
      const author = data?.data;
      form.setFieldsValue({
        name: author?.name,
      });
      if (author?.image) {
        setFileList([{ uid: "", name: author?.name, url: author?.image }]);
      }
    }
  }, [isOpen, mode, data, form]);

  return (
    <Modal
      open={isOpen}
      title={mode === "add" ? "Thêm danh mục" : "Sửa danh mục"}
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
        label="Tên danh mục"
        name="name"
        rules={[
          { required: true, message: "Tên danh mục không được để trống" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Ảnh danh mục">
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

export default AuthorController;
