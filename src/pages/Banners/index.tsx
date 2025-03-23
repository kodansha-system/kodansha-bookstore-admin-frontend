/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Image, Popover, Table } from "antd";
import Header from "@/components/Header";
import AddButton from "@/components/AddButton";
import { useBanners, useUnActiveBanner } from "@/hooks/banners";
import { useState } from "react";
import { IBanner } from "@/models";
import { useQueryClient } from "@tanstack/react-query";
import BannerController from "./components/BannerController";

const Banners = () => {
  const { data, isSuccess, isLoading } = useBanners();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [id, setId] = useState<string>();
  const unActiveBanner = useUnActiveBanner();
  const columnsBanner: any = [
    {
      title: "Tên banner",
      dataIndex: "name",
      key: "name",
      width: "20%",
      ellipsis: true,
      align: "left",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
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
        return <Image src={text} alt="" width={60} height={60} />;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: "10%",
      render: (_: unknown, data: IBanner) => {
        return (
          <div className="flex gap-x-2 justify-center">
            <Button
              onClick={() => handleEditBanner(data._id)}
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
                  <div>Bạn muốn xóa banner này?</div>
                  <div className="text-right">
                    <button
                      onClick={() => handleHideBanner(data?._id)}
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

  const handleAddNewBanner = () => {
    setIsOpen(true);
  };
  const queryClient = useQueryClient();

  const handleEditBanner = (id: string) => {
    setIsOpenEdit(true);
    setId(id);
    queryClient.invalidateQueries({
      queryKey: ["subject", id],
    });
  };

  const handleHideBanner = (id: string) => {
    unActiveBanner.mutateAsync(id);
  };

  return (
    <div>
      <Header
        element={<AddButton onClick={handleAddNewBanner}>Thêm mới</AddButton>}
      >
        Quản lý banners
      </Header>
      <Table
        columns={columnsBanner}
        dataSource={isSuccess ? data?.data?.banners : []}
        loading={isLoading}
        bordered
        className="w-full"
        scroll={{ x: 800 }}
      />

      <BannerController mode="add" isOpen={isOpen} setIsOpen={setIsOpen} />
      <BannerController
        mode="edit"
        id={id}
        isOpen={isOpenEdit}
        setIsOpen={setIsOpenEdit}
      />
    </div>
  );
};

export default Banners;
