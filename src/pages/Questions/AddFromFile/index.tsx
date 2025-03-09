import { Form, message, Modal, Upload, UploadProps } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useCreateQuestionFromFile } from "../../../hooks/questions";

interface IProps {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const { Dragger } = Upload;

const AddFromFile = (props: IProps) => {
  console.log(props);
  const { isOpen, setIsOpen, id } = props;
  const [form] = Form.useForm();
  const [file, setFile] = useState<File>();
  const propsDragDrop: UploadProps = {
    name: "file",
    multiple: true,
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
        setFile(info.file.originFileObj);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.success(`${info.file.name} file uploaded successfully.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const createQuestionsFromFile = useCreateQuestionFromFile();
  const handleSubmit = () => {
    createQuestionsFromFile.mutateAsync({ uploadfile: file!, subjectId: id! });
    setIsOpen(false);
  };

  return (
    <div>
      <Modal
        open={isOpen}
        title="Thêm mới câu hỏi từ file"
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
            onFinish={handleSubmit}
          >
            {dom}
          </Form>
        )}
      >
        <Dragger {...propsDragDrop}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </Dragger>
      </Modal>
    </div>
  );
};

export default AddFromFile;
