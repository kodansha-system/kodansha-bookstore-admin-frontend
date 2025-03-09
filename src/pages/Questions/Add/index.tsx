import { Form, Input, Modal, Radio, RadioChangeEvent } from "antd";
import { IQuestion } from "../../../models";
import { useCreateQuestion } from "../../../hooks/questions";
import { useState } from "react";

interface IProps {
  id: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddQuestions = (props: IProps) => {
  const { isOpen, setIsOpen, id } = props;
  const [form] = Form.useForm();
  const [correctAns, setCorrectAns] = useState(1);
  const onChange = (e: RadioChangeEvent) => {
    setCorrectAns(e.target.value);
  };

  const createQuestions = useCreateQuestion();
  const handleSubmit = (values: IQuestion) => {
    const answers = [
      values?.ans_1,
      values?.ans_2,
      values?.ans_3,
      values?.ans_4,
    ];
    let correctAnswer = "";
    switch (correctAns) {
      case 1:
        correctAnswer = values?.ans_1;
        break;
      case 2:
        correctAnswer = values?.ans_2;
        break;
      case 3:
        correctAnswer = values?.ans_3;
        break;
      case 4:
        correctAnswer = values?.ans_4;
        break;
      default:
        correctAnswer = values?.ans_1;
    }
    const dataSubmit = {
      subject: id,
      answers,
      content: values?.content,
      correctAnswer,
    };

    createQuestions.mutateAsync(dataSubmit);
    setIsOpen(false);
  };

  return (
    <div>
      <Modal
        open={isOpen}
        title="Thêm mới câu hỏi"
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
        <Form.Item label="Nội dung câu hỏi" name="content" required>
          <Input />
        </Form.Item>
        <Form.Item label="Đáp án số 1" name="ans_1" required>
          <Input />
        </Form.Item>
        <Form.Item label="Đáp án số 2" name="ans_2" required>
          <Input />
        </Form.Item>
        <Form.Item label="Đáp án số 3" name="ans_3" required>
          <Input />
        </Form.Item>
        <Form.Item label="Đáp án số 4" name="ans_4" required>
          <Input />
        </Form.Item>
        <div>Đáp án đúng: </div>
        <Radio.Group onChange={onChange} value={correctAns}>
          <Radio value={1}>A</Radio>
          <Radio value={2}>B</Radio>
          <Radio value={3}>C</Radio>
          <Radio value={4}>D</Radio>
        </Radio.Group>
      </Modal>
    </div>
  );
};

export default AddQuestions;
