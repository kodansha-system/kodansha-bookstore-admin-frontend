import { useState } from "react";
import { Button, Form, Input, Table } from "antd";
import type { TableProps } from "antd";
import Header from "../../../components/Header";
import { useQuestionsSubject } from "../../../hooks/questions";
import { useNavigate, useParams } from "react-router-dom";
import { IQuestion } from "../../../models";
import { useCreateTest, useEditTest } from "../../../hooks/tests";

type TableRowSelection<T> = TableProps<T>["rowSelection"];

const columns = [
  {
    title: "Nội dung",
    dataIndex: "content",
    key: "content",
    width: "90%",
    render: (text: string, data: IQuestion) => {
      console.log(text);
      return (
        <div className="text-left">
          <div className="font-medium italic">{data?.content}</div>
          {data?.answers?.map((item: string, index: number) => (
            <div
              className={`${
                item === data?.correctAnswer ? "bg-yellow-300 w-fit" : ""
              }`}
            >
              {index === 0
                ? "A. "
                : index === 1
                ? "B. "
                : index === 2
                ? "C. "
                : "D. "}
              {item}
            </div>
          ))}
        </div>
      );
    },
  },
];

const UpdateTest = () => {
  const { subjectId, testId } = useParams();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { dataQuestionsOfSubject } = useQuestionsSubject(subjectId!);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const hasSelected = selectedRowKeys.length > 0;

  const rowSelection: TableRowSelection<IQuestion> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const createTest = useCreateTest();
  const updateTest = useEditTest();

  const handleAddUpdateTest = () => {
    form.submit();
    if (!testId) {
      createTest.mutate({
        ...form.getFieldsValue(),
        questions: selectedRowKeys,
        subject: subjectId,
      });
      navigate(`/tests/subjects/${subjectId}`);
      return;
    }
    updateTest.mutate({
      ...form.getFieldsValue,
      questions: selectedRowKeys,
      id: testId,
    });
    navigate(`/tests/subjects/${subjectId}`);
  };

  return (
    <div>
      <Header
        element={
          <Button
            onClick={handleAddUpdateTest}
            className="bg-green-700 px-10 py-5 text-base text-white"
          >
            {testId ? "Cập nhật" : "Thêm"}
          </Button>
        }
      >
        {`${testId ? "Cập nhật" : "Thêm"} câu hỏi cho bài test`}
      </Header>
      {!testId ? (
        <Form form={form} layout="vertical" className="w-[50%] mb-10">
          <Form.Item name="name" label="Tên bài test">
            <Input />
          </Form.Item>
          <Form.Item name="duration" label="Thời gian">
            <Input type="number" />
          </Form.Item>
        </Form>
      ) : null}
      {hasSelected ? `Đã chọn ${selectedRowKeys.length} câu hỏi` : null}
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataQuestionsOfSubject}
      />
    </div>
  );
};

export default UpdateTest;
