import { useParams } from "react-router-dom";
import { useDetailTest } from "../../../hooks/tests";
import Header from "../../../components/Header";
import { Table } from "antd";
import { IQuestion } from "../../../models";

const TestDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useDetailTest(id!);
  const columns = [
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: "70%",
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
  return (
    <div>
      <Header>Danh sách câu hỏi thuộc bài test</Header>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data?.data?.data?.test?.questions}
      />
    </div>
  );
};

export default TestDetail;
