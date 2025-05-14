import { Button, Image, Input, Popover } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useState } from "react";
import { IReview } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import TableCommon from "@/components/TableCommon";
import {
  useReviews,
  useUnActiveReview,
  useVerifiedReview,
} from "@/hooks/reviews";
import ReviewController from "./components/ReviewController";

const Reviews = () => {
  const [filter, setFilter] = useState({
    current: 1,
    pageSize: 10,
    keyword: "",
  });
  const { data, isSuccess, isLoading } = useReviews(filter);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveReview = useUnActiveReview();
  const queryClient = useQueryClient();
  const verifyReview = useVerifiedReview();

  const columnsReview: any = [
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: "15%",
      ellipsis: true,
      align: "left",
      render: (text: string) => {
        return <div>{new Date(text).toLocaleString()}</div>;
      },
    },
    {
      title: "Người đánh giá",
      dataIndex: "created_by",
      key: "created_by",
      width: "15%",
      ellipsis: true,
      align: "left",
      render: (text: any) => {
        return <div>{text?.name}</div>;
      },
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      width: "25%",
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
      width: "30%",
      render: (_: unknown, data: IReview) => {
        return (
          <div className="flex gap-x-3 justify-center">
            <Button
              onClick={() =>
                verifyReview.mutateAsync({
                  ...data,
                  is_verified: !data.is_verified,
                })
              }
            >
              {data.is_verified ? "Bỏ xác thực" : "Xác thực"}
            </Button>
            {/* <EditButton onClick={() => handleEditReview(data?.id)} /> */}
            <Popover
              placement="top"
              title={"Xác nhận"}
              content={
                <>
                  <div>Bạn muốn xóa review này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideReview(data?.id)}
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

  const handleAddNewReview = () => {
    setIsOpen(true);
  };

  const handleEditReview = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
  };

  const handleHideReview = (id: string) => {
    unActiveReview.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewReview}>Thêm mới</AddButton>}
      >
        Quản lý đánh giá
      </Header>

      <Input.Search
        placeholder="Tìm kiếm review"
        allowClear
        onSearch={(value) => {
          setFilter((prev) => ({
            ...prev,
            current: 1,
            keyword: value,
          }));
        }}
        style={{ width: 300 }}
        className="mb-3"
      />

      <TableCommon
        columns={columnsReview}
        dataSource={isSuccess ? data?.data?.reviews : []}
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

      <ReviewController mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
      <ReviewController
        mode="edit"
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Reviews;
