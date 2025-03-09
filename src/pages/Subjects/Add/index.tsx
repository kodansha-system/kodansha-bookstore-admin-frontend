import { Form, Input, Modal, Radio } from "antd";
import { useCreateSubject } from "../../../hooks/subjects";
import { ISubject } from "../../../models";
import { PlusOutlined } from "@ant-design/icons";
import { Image, Upload } from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { useState } from "react";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const AddSubject = (props: IProps) => {
  const { isOpen, setIsOpen } = props;
  const [form] = Form.useForm();
  const createSubject = useCreateSubject();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const handleSubmit = (values: ISubject) => {
    const image = fileList[0].originFileObj as File;
    createSubject.mutateAsync({ ...values, image });
    setIsOpen(false);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <div>
      <Modal
        open={isOpen}
        title="Thêm môn học"
        okText="Tạo"
        cancelText="Hủy"
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        onCancel={() => setIsOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={form}
            name="form_in_modal"
            initialValues={{ modifier: "public" }}
            clearOnDestroy
            onFinish={(values) => handleSubmit(values)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item label="Tên môn học" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Số tín chỉ" name="numberOfCredit">
          <Input />
        </Form.Item>
        <Form.Item label="Ảnh" name="image">
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={1}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
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
        <Form.Item label="Trạng thái">
          <Radio.Group name="status">
            <Radio value="active"> Active </Radio>
            <Radio value="unactive"> Unactive </Radio>
          </Radio.Group>
        </Form.Item>
      </Modal>
    </div>
  );
};

export default AddSubject;
