import { Image, Input, message, Popover } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useState } from "react";
import { IBooks } from "@/models";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import TableCommon from "@/components/TableCommon";
import { useBooks, useUnActiveBook } from "@/hooks/books";
import BookController from "./components/BookController";
import { editBook } from "@/services/books";
import { QueryKeys } from "@/constants";

const Books = () => {
  const [filter, setFilter] = useState({
    current: 1,
    pageSize: 10,
    keyword: "",
  });
  const { data, isSuccess, isLoading } = useBooks(filter);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const queryClient = useQueryClient();

  const columnsBook: any = [
    {
      title: "Tên sách",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "20%",
      ellipsis: true,
      align: "left",
      render: (text: any) => {
        return (
          <div>
            <div>{text?.toLocaleString()}đ</div>
          </div>
        );
      },
    },
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      width: "10%",
      render: (text: string) => {
        return <Image src={text?.[0]} alt="" width={50} height={40} />;
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: "20%",
      render: (text: string, data: any) => {
        return (
          <div>
            <div>Còn lại: {text?.toLocaleString()}</div>
            <div>Đã bán: {data?.total_sold?.toLocaleString()}</div>
          </div>
        );
      },
      align: "left",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "20%",
      render: (_: unknown, data: IBooks) => {
        return (
          <div className="flex gap-x-3 justify-center">
            <EditButton onClick={() => handleEditBook(data?.id)} />
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn tạm ngừng kinh doanh sách này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideBook(data?.id || data?._id)}
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

  const handleAddNewBook = () => {
    setIsOpen(true);
  };

  const handleEditBook = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
  };

  const editBooks: any = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) =>
      await editBook(formData, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BOOKS] });
      message.success("Đã đôi trạng thái sách về tạm ngừng kinh doanh!");
    },
  });

  const handleHideBook = (id: string) => {
    const formData = new FormData();
    formData.append("quantity", "0");
    editBooks.mutate({ id, formData });
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewBook}>Thêm mới</AddButton>}
      >
        Quản lý bài viết
      </Header>

      <Input.Search
        placeholder="Tìm kiếm book"
        allowClear
        onSearch={(value) => {
          setFilter((prev) => ({
            ...prev,
            keyword: value,
            current: 1, // reset về trang 1 khi search
          }));
        }}
        style={{ width: 300 }}
        className="mb-3"
      />

      <TableCommon
        columns={columnsBook}
        dataSource={isSuccess ? data?.data?.books : []}
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

      <BookController mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
      <BookController
        mode="edit"
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Books;
