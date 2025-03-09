import { Button, Image, Table } from "antd";
import Header from "../../components/Header";
import { ISubject } from "../../models";
import { useSubjects } from "../../hooks/subjects";
import { useNavigate } from "react-router-dom";

const Tests = () => {
  const { data, isSuccess, isLoading } = useSubjects();
  const navigate = useNavigate();

  const columnsSubject = [
    {
      title: "Tên môn",
      dataIndex: "name",
      key: "name",
      width: "30%",
      render: (text: string) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Số tín chỉ",
      dataIndex: "numberOfCredit",
      key: "numberOfCredit",
      width: "10%",
      render: (text: number) => {
        return <div>{text}</div>;
      },
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (text: string) => {
        return <Image src={text} alt="" width={50} height={50} />;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (text: boolean) => {
        return <div>{text ? "active" : "unactive"}</div>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (_: unknown, data: ISubject) => {
        return (
          <div className="flex gap-x-2 justify-center">
            <Button
              onClick={() => navigate(`/tests/subjects/${data?._id}`)}
              className="w-20 bg-orange-400 text-white"
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
      <Header>Quản lý bài test</Header>
      <Table
        columns={columnsSubject}
        dataSource={isSuccess ? data?.data?.data?.subjects : []}
        loading={isLoading}
        bordered
        className="w-[95%]"
      />
    </div>
  );
};

export default Tests;
