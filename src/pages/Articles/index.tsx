import { Image, Input, Popover } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useState } from "react";
import { IArticle } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import TableCommon from "@/components/TableCommon";
import { useArticles, useUnActiveArticle } from "@/hooks/articles";
import ArticleController from "./components/ArticleController";

const Articles = () => {
  const [filter, setFilter] = useState({
    current: 1,
    pageSize: 10,
    keyword: "",
  });
  const { data, isSuccess, isLoading } = useArticles(filter);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveArticle = useUnActiveArticle();
  const queryClient = useQueryClient();

  const columnsArticle: any = [
    {
      title: "Tên article",
      dataIndex: "title",
      key: "title",
      width: "20%",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Mô tả",
      dataIndex: "content",
      key: "content",
      width: "30%",
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
      render: (_: unknown, data: IArticle) => {
        return (
          <div className="flex gap-x-3 justify-center">
            <EditButton onClick={() => handleEditArticle(data?.id)} />
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn xóa article này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideArticle(data?.id)}
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

  const handleAddNewArticle = () => {
    setIsOpen(true);
  };

  const handleEditArticle = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
  };

  const handleHideArticle = (id: string) => {
    unActiveArticle.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewArticle}>Thêm mới</AddButton>}
      >
        Quản lý articles
      </Header>

      <Input.Search
        placeholder="Tìm kiếm article"
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
        columns={columnsArticle}
        dataSource={isSuccess ? data?.data?.articles : []}
        loading={isLoading}
        pagination={{
          total: data?.data?.meta?.totalItems,
          current: filter.current,
          pageSize: filter.pageSize,
          onChange: (page, pageSize) => {
            setFilter({ ...filter, current: page, pageSize });
          },
        }}
      />

      <ArticleController mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
      <ArticleController
        mode="edit"
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Articles;
