import { Form, Input, Modal, Radio } from "antd";
import { useEffect } from "react";
import { IUser } from "../../../models";
import { useDetailUser, useEditUser } from "../../../hooks/users";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
}

const EditSubject = (props: IProps) => {
  const { isOpen, setIsOpen, id } = props;
  const [form] = Form.useForm();
  const editUser = useEditUser();

  const { data } = useDetailUser(id);

  const handleSubmit = (values: IUser) => {
    const id = data?.data?.data?.user?._id;
    editUser.mutateAsync({ ...values, id });
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen && data) {
      const user = data?.data?.data?.user;
      form.setFieldsValue(user);
    }
  }, [isOpen, data, form]);

  return (
    <div>
      <Modal
        open={isOpen}
        title="Sưa thông tin người dùng"
        okText="Update"
        cancelText="Cancel"
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
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Họ và tên" name="fullname">
          <Input />
        </Form.Item>
        <Form.Item label="Trạng thái" name="isLocked">
          <Radio.Group name="isLocked">
            <Radio value={true}> Unactive </Radio>
            <Radio value={false}> Active </Radio>
          </Radio.Group>
        </Form.Item>
      </Modal>
    </div>
  );
};

export default EditSubject;
