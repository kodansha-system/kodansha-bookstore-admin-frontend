import { Button, Image, Popover, Table } from "antd";
import Header from "../../components/Header";
import AddButton from "../../components/AddButton";
import { useSubjects, useUnActiveSubject } from "../../hooks/subjects";
import { useState } from "react";
import AddSubject from "./Add";
import EditSubject from "./Edit";
import { ISubject } from "../../models";
import { useQueryClient } from "@tanstack/react-query";

const Subjects = () => {
  const { data, isSuccess, isLoading } = useSubjects();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveSubject = useUnActiveSubject();
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
              onClick={() => handleEditSubject(data._id)}
              type="primary"
              className="bg-blue-400 w-[90px] text-white"
            >
              Sửa
            </Button>
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn ẩn môn học này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideSubject(data?._id)}
                      className="bg-blue-500 text-white py-1 px-2 mt-2 rounded-md"
                    >
                      OK
                    </button>
                  </div>
                </>
              }
            >
              <Button type="dashed" className="bg-red-500 text-white">
                Unactive
              </Button>
            </Popover>
          </div>
        );
      },
    },
  ];

  const handleAddNewSubject = () => {
    setIsOpen(true);
  };
  const queryClient = useQueryClient();

  const handleEditSubject = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
  };

  const handleHideSubject = (id: string) => {
    unActiveSubject.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewSubject}>Thêm mới</AddButton>}
      >
        Quản lý môn học
      </Header>
      <Table
        columns={columnsSubject}
        dataSource={isSuccess ? data?.data?.data?.subjects : []}
        loading={isLoading}
        bordered
        className="w-[95%]"
      />

      <AddSubject isOpen={isOpen} setIsOpen={setIsOpen} />
      <EditSubject isOpen={isOpenEdit} setIsOpen={setIsOpenEdit} id={id!} />
    </div>
  );
};

export default Subjects;
