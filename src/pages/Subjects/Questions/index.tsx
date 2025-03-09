import { useParams } from "react-router-dom";
import Header from "../../../components/Header";
import { Table } from "antd";
import { IQuestion } from "../../../models";
import { useQuestionsSubject } from "../../../hooks/questions";

const SubjectQuestions = () => {
  const { subjectId } = useParams();
  const { dataQuestionsOfSubject } = useQuestionsSubject(subjectId!);
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
  console.log({ dataQuestionsOfSubject });
  return (
    <div>
      <Header>Danh sách câu hỏi thuộc môn học</Header>
      <Table columns={columns} dataSource={dataQuestionsOfSubject} />
    </div>
  );
};

export default SubjectQuestions;
