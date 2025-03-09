import { Form, Image, Input, Modal, Radio, Upload } from "antd";
import { useDetailSubject, useEditSubject } from "../../../hooks/subjects";
import { useEffect, useState } from "react";
import { ISubject } from "../../../models";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
const EditSubject = (props: IProps) => {
  const { isOpen, setIsOpen, id } = props;
  const [form] = Form.useForm();
  const editSubject = useEditSubject();
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

  const { data } = useDetailSubject(id);

  const handleSubmit = (values: ISubject) => {
    const image = fileList[0].originFileObj as File;
    const id = data?.data?.data?.subject?._id;
    editSubject.mutateAsync({ ...values, id, image });
    setIsOpen(false);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  useEffect(() => {
    if (isOpen && data) {
      const subject = data?.data?.data?.subject;
      console.log(subject?.status);
      form.setFieldsValue({
        name: subject?.name,
        numberOfCredit: subject?.numberOfCredit,
        status: subject?.status,
      });
      if (subject?.image) {
        setFileList([
          {
            uid: "",
            name: subject?.name,
            url: subject?.image,
          },
        ]);
      }
    }
  }, [isOpen, data, form]);

  return (
    <div>
      <Modal
        open={isOpen}
        title="Sửa môn học"
        okText="Sửa"
        cancelText="Hủy"
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        onCancel={() => setIsOpen(false)}
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
        <Form.Item name="_id" hidden>
          <Input name="_id" />
        </Form.Item>
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
        <Form.Item label="Trạng thái" name="status">
          <Radio.Group name="status">
            <Radio value={true}> Active </Radio>
            <Radio value={false}> Unactive </Radio>
          </Radio.Group>
        </Form.Item>
      </Modal>
    </div>
  );
};

export default EditSubject;
