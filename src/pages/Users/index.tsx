/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Image, Popover, Table } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useUsers, useUnActiveUser } from "@/hooks/users";
import { useState } from "react";
import { IUser } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import UserController from "./components/UserController";
import { Action } from "@/enum/actions";

const Users = () => {
  const { data, isSuccess, isLoading } = useUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveUser = useUnActiveUser();
  const columnsUser: any = [
    {
      title: "Tên user",
      dataIndex: "name",
      key: "name",
      width: "200px",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Role",
      dataIndex: ["role", "name"],
      key: "role",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: "80px",
      render: (text: string) => {
        return (
          <div className="flex justify-center">
            <Image src={text} alt="" width={60} height={60} />
          </div>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "150px",
      render: (_: unknown, data: IUser) => {
        return (
          <div className="flex gap-x-2 justify-center">
            <Button
              onClick={() => handleEditUser(data._id)}
              type="primary"
              className="bg-blue-400 text-white"
            >
              Sửa
            </Button>
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn xóa user này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideUser(data?._id)}
                      className="bg-blue-500 text-white py-1 px-2 mt-2 rounded-md"
                    >
                      OK
                    </button>
                  </div>
                </>
              }
            >
              <Button type="dashed" className="bg-red-500 text-white">
                Xóa
              </Button>
            </Popover>
          </div>
        );
      },
    },
  ];

  const handleAddNewUser = () => {
    setIsOpen(true);
  };
  const queryClient = useQueryClient();

  const handleEditUser = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
  };

  const handleHideUser = (id: string) => {
    unActiveUser.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewUser}>Thêm mới</AddButton>}
      >
        Quản lý users
      </Header>
      <Table
        columns={columnsUser}
        dataSource={isSuccess ? data?.data?.users : []}
        loading={isLoading}
        bordered
        className="w-full"
        scroll={{ x: 800 }}
      />

      <UserController mode={Action.ADD} isOpen={isOpen} setIsOpen={setIsOpen} />
      <UserController
        mode={Action.EDIT}
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Users;
