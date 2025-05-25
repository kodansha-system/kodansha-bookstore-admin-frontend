import { Image, Input, Popover } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useState } from "react";
import { IAuthor } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import TableCommon from "@/components/TableCommon";
import { useAuthors, useDeleteAuthor } from "@/hooks/authors";
import AuthorController from "./components/AuthorController";
import dayjs from "dayjs";

const Authors = () => {
  const [filter, setFilter] = useState({
    current: 1,
    pageSize: 10,
    keyword: "",
  });
  const { data, isSuccess, isLoading } = useAuthors(filter);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveAuthor = useDeleteAuthor();
  const queryClient = useQueryClient();

  console.log(data);

  const columnsAuthor: any = [
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: "20%",
      ellipsis: true,
      align: "left",
      render: (text: any) => <div>{dayjs(text)?.format("DD/MM/YYYY")}</div>,
    },
    {
      title: "Tên tác giả",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      width: "10%",
      render: (text: string) => {
        return text && <Image src={text} alt="" width={50} height={40} />;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (_: unknown, data: IAuthor) => {
        return (
          <div className="flex gap-x-3 justify-center">
            <EditButton onClick={() => handleEditAuthor(data?.id)} />
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn xóa tác giả này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideAuthor(data?.id)}
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

  const handleAddNewAuthor = () => {
    setIsOpen(true);
  };

  const handleEditAuthor = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["author", id],
    });
  };

  const handleHideAuthor = (id: string) => {
    unActiveAuthor.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewAuthor}>Thêm mới</AddButton>}
      >
        Quản lý tác giả
      </Header>

      <Input.Search
        placeholder="Tìm kiếm Author"
        allowClear
        onSearch={(value) => {
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
        columns={columnsAuthor}
        dataSource={isSuccess ? data?.data?.authors : []}
        loading={isLoading}
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

      <AuthorController mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
      <AuthorController
        mode="edit"
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Authors;
