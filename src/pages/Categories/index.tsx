import { Image, Input, Popover } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useState } from "react";
import { ICategory } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import TableCommon from "@/components/TableCommon";
import { useCategories, useDeleteCategory } from "@/hooks/categories";
import CategoryController from "./components/CategoryController";
import dayjs from "dayjs";

const Categories = () => {
  const [filter, setFilter] = useState({
    current: 1,
    pageSize: 10,
    keyword: "",
  });
  const { data, isSuccess, isLoading } = useCategories(filter);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveCategory = useDeleteCategory();
  const queryClient = useQueryClient();

  console.log(data);

  const columnsCategory: any = [
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: "20%",
      ellipsis: true,
      align: "left",
      render: (text: any) => <div>{dayjs(text)?.format("DD / MM / YYYY")}</div>,
    },
    {
      title: "Tên danh mục",
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
        return <Image src={text} alt="" width={50} height={40} />;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (_: unknown, data: ICategory) => {
        return (
          <div className="flex gap-x-3 justify-center">
            <EditButton onClick={() => handleEditCategory(data?.id)} />
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn xóa danh mục này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideCategory(data?.id)}
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

  const handleAddNewCategory = () => {
    setIsOpen(true);
  };

  const handleEditCategory = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["category", id],
    });
  };

  const handleHideCategory = (id: string) => {
    unActiveCategory.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewCategory}>Thêm mới</AddButton>}
      >
        Quản lý danh mục sách
      </Header>

      <Input.Search
        placeholder="Tìm kiếm Category"
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
        columns={columnsCategory}
        dataSource={isSuccess ? data?.data?.categories : []}
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

      <CategoryController mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
      <CategoryController
        mode="edit"
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Categories;
