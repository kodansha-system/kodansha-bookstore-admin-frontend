import { Form, Input, Modal, Radio } from "antd";
import { useCreateUser } from "../../../hooks/users";
import { IUser } from "../../../models";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddUser = (props: IProps) => {
  const { isOpen, setIsOpen } = props;
  const [form] = Form.useForm();
  const createUser = useCreateUser();

  const handleSubmit = (values: IUser) => {
    console.log({ values });
    createUser.mutateAsync(values);
  };

  return (
    <div>
      <Modal
        open={isOpen}
        title="Thêm mới người dùng"
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
        <Form.Item label="Email" name="email" required>
          <Input />
        </Form.Item>
        <Form.Item label="Họ tên" name="fullname">
          <Input />
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

export default AddUser;
