/* eslint-disable @typescript-eslint/no-explicit-any */
import { Image, Input, Popover } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useStaffs, useUnActiveStaff } from "@/hooks/staffs";
import { useState } from "react";
import { IStaff } from "@/models";
import { Action } from "@/enum/actions";
import TableCommon from "@/components/TableCommon";
import EditButton from "@/components/EditButton";
import DeleteButton from "@/components/DeleteButton";
import StaffController from "./components/StaffController";

const Staffs = () => {
  const [filter, setFilter] = useState({
    keyword: undefined,
    current: 1,
    pageSize: 10,
  });
  const { data, isSuccess, isLoading } = useStaffs(filter);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveStaff = useUnActiveStaff();

  const columnsStaff: any = [
    {
      title: "Tên staff",
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
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: "100px",
      render: (text: string) => {
        return (
          <div className="flex justify-center">
            {text && <Image src={text} alt="" width={60} height={60} />}
          </div>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "150px",
      render: (_: unknown, data: IStaff) => {
        return (
          <div className="flex gap-x-2 justify-center">
            <EditButton onClick={() => handleEditStaff(data?.id)} />

            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn xóa staff này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideStaff(data?.id)}
                      className="bg-blue-500 text-white py-1 px-2 mt-2 rounded-md"
                    >
                      OK
                    </button>
                  </div>
                </>
              }
            >
              <DeleteButton />
            </Popover>
          </div>
        );
      },
    },
  ];

  const handleAddNewStaff = () => {
    setIsOpen(true);
  };

  const handleEditStaff = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
  };

  const handleHideStaff = (id: string) => {
    unActiveStaff.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewStaff}>Thêm mới</AddButton>}
      >
        Quản lý nhân viên
      </Header>

      <Input.Search
        placeholder="Tìm kiếm nhân viên"
        allowClear
        onSearch={(value: any) => {
          setFilter((prev) => ({
            ...prev,
            keyword: value,
            current: 1,
          }));
        }}
        style={{ width: 300 }}
        className="mb-3"
      />

      <TableCommon
        columns={columnsStaff}
        dataSource={isSuccess ? data?.data?.staffs : []}
        loading={isLoading}
        bordered
        className="w-full"
        scroll={{ x: 800 }}
        pagination={{
          showSizeChanger: true,
          total: data?.data?.meta?.totalItems,
          current: filter.current,
          pageSize: filter.pageSize,
          onChange: (page, pageSize) => {
            setFilter({ ...filter, current: page, pageSize });
          },
        }}
      />
      <StaffController
        mode={Action.ADD}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <StaffController
        mode={Action.EDIT}
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Staffs;
