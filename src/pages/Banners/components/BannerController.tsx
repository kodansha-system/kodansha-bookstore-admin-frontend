import { Form, Input, Modal, Select, Upload, Image } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import {
  useCreateBanner,
  useDetailBanner,
  useEditBanner,
} from "@/hooks/banners";
import { IBanner } from "@/models";
import { Action } from "@/enum/actions";
import { FileType, getBase64 } from "@/utils/file";
import instance from "@/services/apiRequest";
import { filterOptions } from "@/utils/common";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "add" | "edit";
  id?: string;
}

const BannerController = ({ isOpen, setIsOpen, mode, id }: IProps) => {
  const [form] = Form.useForm();
  const createBanner = useCreateBanner();
  const editBanner = useEditBanner();
  const { data } = useDetailBanner(id || "");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [books, setBooks] = useState([]);

  const handleGetListBook = async () => {
    const res = await instance.get("/books", {
      params: {
        get_all: true,
      },
    });
    const data = res?.data?.books?.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    setBooks(data);
    return data;
  };

  const handleSubmit = async (values: IBanner) => {
    try {
      const data = await form.validateFields();
      console.log("check ", data);
      if (fileList.length === 0) {
        setImageError(true);
        return;
      } else {
        setImageError(false);
      }

      setIsLoading(true);
      const image = fileList[0]?.originFileObj as File | undefined;

      if (mode === Action.ADD) {
        await createBanner.mutateAsync({ ...values, image });
      } else if (mode === "edit" && id) {
        await editBanner.mutateAsync({ ...values, id, image });
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
      const banner = data?.data;
      form.setFieldsValue({
        name: banner?.name,
        status: banner?.status,
        description: banner?.description,
        book_id: banner?.book_id,
      });
      if (banner?.image) {
        setFileList([{ uid: "", name: banner?.name, url: banner?.image }]);
      }
    }
  }, [isOpen, mode, data, form]);

  useEffect(() => {
    handleGetListBook();
  }, []);
  return (
    <Modal
      open={isOpen}
      title={mode === "add" ? "Thêm banner" : "Sửa banner"}
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
        label="Tên banner"
        name="name"
        rules={[{ required: true, message: "Tên banner không được để trống" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Mô tả" name="description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Ảnh">
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
      <Form.Item name="book_id" label="Sách">
        <Select
          options={books}
          allowClear
          showSearch
          filterOption={filterOptions}
        />
      </Form.Item>
    </Modal>
  );
};

export default BannerController;
