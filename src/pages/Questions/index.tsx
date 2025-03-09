import { Button, Image, Table } from "antd";
import Header from "../../components/Header";
import { ISubject } from "../../models";
import { useSubjects } from "../../hooks/subjects";
import { useState } from "react";
import AddQuestions from "./Add";
import AddFromFile from "./AddFromFile";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFileUpload, setIsOpenFileUpload] = useState(false);
  // const [isOpenEdit, setIsOpenEdit] = useState(false);
  const { data, isSuccess, isLoading } = useSubjects();
  const [idSubject, setIdSubject] = useState<string>();
  const navigate = useNavigate();

  const handleAddQuestion = (id: string) => {
    setIdSubject(id);
    setIsOpen(true);
  };

  const handleAddQuestionFromFile = (id: string) => {
    setIdSubject(id);
    setIsOpenFileUpload(true);
  };

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
              onClick={() => handleAddQuestion(data._id)}
              className="bg-blue-400 w-[90px] text-white"
            >
              Nhập
            </Button>
            <Button
              onClick={() => handleAddQuestionFromFile(data._id)}
              className="w-20 bg-green-400 text-white"
            >
              File
            </Button>
            <Button
              onClick={() => navigate(`/questions/subject/${data?._id}`)}
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
      <Header>Quản lý câu hỏi</Header>
      <Table
        columns={columnsSubject}
        dataSource={isSuccess ? data?.data?.data?.subjects : []}
        loading={isLoading}
        bordered
        className="w-[95%]"
      />
      <AddQuestions isOpen={isOpen} setIsOpen={setIsOpen} id={idSubject!} />
      <AddFromFile
        isOpen={isOpenFileUpload}
        setIsOpen={setIsOpenFileUpload}
        id={idSubject!}
      />
    </div>
  );
};

export default Questions;
