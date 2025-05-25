import {
  Form,
  Input,
  Modal,
  Upload,
  Image,
  InputNumber,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { useCreateBook, useDetailBook, useEditBook } from "@/hooks/books";
import { Action } from "@/enum/actions";
import { FileType, getBase64 } from "@/utils/file";
import TiptapEditor from "./TiptapEditor";
import instance from "@/services/apiRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "@/constants";
import { editBook } from "@/services/books";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "add" | "edit";
  id?: string;
}

const BookController = ({ isOpen, setIsOpen, mode, id }: IProps) => {
  const [form] = Form.useForm();
  const createBook = useCreateBook();
  const queryClient = useQueryClient();
  const { data } = useDetailBook(id || "");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [listCategories, setListCategories] = useState([]);
  const [listAuthors, setListAuthors] = useState([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const handleGetListCategories = async () => {
    const res = await instance.get("/categories");
    const res2 = await instance.get("/authors", {
      params: {
        get_all: true,
      },
    });

    setListCategories(
      res?.data?.categories?.map((item: any) => {
        return { value: item.id, label: item.name };
      })
    );

    setListAuthors(
      res2?.data?.authors?.map((item: any) => {
        return { value: item.id, label: item.name };
      })
    );
  };

  const editBooks: any = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) =>
      await editBook(formData, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKS] });
      message.success("Sửa book thành công!");
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      await form.validateFields();
      if (fileList.length === 0) {
        setImageError(true);
        return;
      } else {
        setImageError(false);
      }

      setIsLoading(true);
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}`, item);
          });
        } else {
          formData.append(
            key,
            value !== undefined && value !== null ? String(value) : ""
          );
        }
      });

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      formData.append("existing_images", JSON.stringify(existingImages));

      if (mode === Action.ADD) {
        await createBook.mutateAsync(formData);
      } else if (mode === "edit" && id) {
        await editBooks.mutateAsync({ id, formData });
      }

      // setIsOpen(false);
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
    const removedFiles = fileList.filter(
      (file) => !newFileList.find((f) => f.uid === file.uid)
    );

    removedFiles.forEach((file) => {
      if (file.url) {
        setExistingImages((prev) => prev.filter((url) => url !== file.url));
      }
    });

    setFileList(newFileList);
    setImageError(newFileList.length === 0);
  };

  const handleSetData = async () => {
    await handleGetListCategories();
    const book = data?.data;
    form.setFieldsValue({
      ...book,
      authors: book?.authors?.map((item: any) => item.id),
      category_id: book?.category_id?.id,
    });
    if (book?.images?.length) {
      setExistingImages(book.images);

      setFileList(
        book.images.map((img: string, idx: number) => ({
          uid: String(idx),
          name: `image-${idx}`,
          url: img,
        }))
      );
    }
  };
  useEffect(() => {
    if (isOpen && mode === "edit" && data) {
      handleSetData();
    } else {
      handleGetListCategories();
    }
  }, [isOpen, mode, data, form]);

  return (
    <Modal
      open={isOpen}
      title={mode === "add" ? "Thêm sách" : "Sửa sách"}
      okText={mode === "add" ? "Tạo" : "Lưu"}
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
      <Form.Item name="name" label="Tên sách" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="authors" label="Tác giả" rules={[{ required: true }]}>
        <Select mode="multiple" options={listAuthors} />
      </Form.Item>
      <Form.Item
        name="category_id"
        label="Thể loại"
        rules={[{ required: true }]}
      >
        <Select options={listCategories} />
      </Form.Item>
      <Form.Item label="Mô tả" name="description" rules={[{ required: true }]}>
        <TiptapEditor
          value={form.getFieldValue("description")}
          onChange={(val) => form.setFieldsValue({ description: val })}
        />
      </Form.Item>
      <Form.Item
        name="company_publish"
        label="Nhà xuất bản"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="total_pages"
        label="Số trang"
        rules={[{ required: true }]}
      >
        <InputNumber min={1} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="cover_type"
        label="Loại bìa"
        rules={[{ required: true }]}
      >
        <Input style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="total_sold" label="Đã bán" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="price" label="Giá bán" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="origin_price"
        label="Giá gốc"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="width"
        label="Chiều rộng (cm)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="length"
        label="Chiều dài (cm)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="height"
        label="Chiều cao (cm)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="weight"
        label="Khối lượng (g)"
        rules={[{ required: true }]}
      >
        <InputNumber min={0} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Ảnh sách">
        <Upload
          beforeUpload={() => false}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={5}
        >
          {fileList.length >= 5 ? null : (
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tải lên</div>
            </button>
          )}
        </Upload>
        {imageError && (
          <div style={{ color: "red", fontSize: 12 }}>
            Vui lòng chọn ít nhất một ảnh
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

export default BookController;
