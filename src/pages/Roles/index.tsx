/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Popover, Table } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useState } from "react";
import { IRole } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import { Action } from "@/enum/actions";
import RoleController from "./components/RoleController";
import { useRoles, useUnActiveRole } from "@/hooks/roles";

const Roles = () => {
  const { data, isSuccess, isLoading } = useRoles();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveRole = useUnActiveRole();
  const columnsRole: any = [
    {
      title: "Tên role",
      dataIndex: "name",
      key: "name",
      width: "200px",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "150px",
      render: (_: unknown, data: IRole) => {
        return (
          <div className="flex gap-x-2 justify-center">
            <Button
              onClick={() => handleEditRole(data._id)}
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
                  <div>Bạn muốn xóa role này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideRole(data?._id)}
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

  const handleAddNewRole = () => {
    setIsOpen(true);
  };
  const queryClient = useQueryClient();

  const handleEditRole = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
  };

  const handleHideRole = (id: string) => {
    unActiveRole.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewRole}>Thêm mới</AddButton>}
      >
        Quản lý roles
      </Header>
      <Table
        columns={columnsRole}
        dataSource={isSuccess ? data?.data?.roles : []}
        loading={isLoading}
        bordered
        className="w-full"
        scroll={{ x: 800 }}
      />

      <RoleController mode={Action.ADD} isOpen={isOpen} setIsOpen={setIsOpen} />
      <RoleController
        mode={Action.EDIT}
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Roles;
