import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import { useTests } from "../../../hooks/tests";
import { Button, Table } from "antd";
import { ITest } from "../../../models";

const TestsOfSubject = () => {
  const { subjectId } = useParams();
  console.log(subjectId);
  const { data, isSuccess, isLoading } = useTests(subjectId!);
  function getDateFromDatetimeString(datetimeStr: Date) {
    const date = new Date(datetimeStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const navigate = useNavigate();
  const columnsTest = [
    {
      title: "Tên bài test",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text: string) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      width: "10%",
      render: (text: string) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "30%",
      render: (text: Date) => {
        return <div>{getDateFromDatetimeString(text)}</div>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "30%",
      render: (_: string, data: ITest) => {
        return (
          <div className="flex gap-x-5 justify-center">
            <Button
              onClick={() => {
                navigate(`/tests/${data?._id}/subject/${subjectId}/update`);
              }}
            >
              Update
            </Button>
            <Button
              onClick={() => {
                navigate(`/tests/${data?._id}`);
              }}
            >
              Xem
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <Header
        element={
          <Button
            onClick={() => navigate(`/tests/subject/${subjectId}/create`)}
            className="bg-green-500 px-10 py-5 text-base text-white mr-10"
          >
            Thêm mới
          </Button>
        }
      >
        Danh sách các bài test của môn
      </Header>
      <Table
        columns={columnsTest}
        dataSource={isSuccess ? data?.data?.data?.test : []}
        loading={isLoading}
        bordered
        className="w-[95%]"
      />
    </div>
  );
};

export default TestsOfSubject;
