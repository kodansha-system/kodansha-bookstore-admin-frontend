import { Button } from "antd";
import Header from "@/components/Header";
import { useState } from "react";
import { IOrder } from "@/models";
import TableCommon from "@/components/TableCommon";
import { useOrders } from "@/hooks/orders";
import { OrderStatus, OrderStatusText } from "@/utils/common";
import { useNavigate } from "react-router-dom";
import UpdateOrderStatusModal from "./components/UpdateOrderStatus";
import CancelOrderModal from "./components/CancelOrder";

const Orders = () => {
  const [filter, setFilter] = useState({
    current: 1,
    pageSize: 10,
  });
  const { data, isSuccess, isLoading, refetch } = useOrders(filter);
  const navigate = useNavigate();

  const columnsOrder: any = [
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      ellipsis: true,
      align: "left",
      render: (text: string) => {
        return <div>{new Date(text).toLocaleString()}</div>;
      },
    },
    {
      title: "Người đặt hàng",
      dataIndex: "user_id",
      key: "user_id",
      width: 250,
      ellipsis: true,
      align: "left",
      render: (text: any) => {
        return (
          <div>
            <div>Email: {text?.email}</div>
            <div>Họ và tên: {text?.name}</div>
            <div>SĐT: {text?.phone_number}</div>
          </div>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "order_status",
      key: "order_status",
      width: 200,
      render: (text: OrderStatus) => {
        return (
          <div
            className={`${
              text === OrderStatus.New && "text-red-500 font-medium"
            }`}
          >
            {OrderStatusText[text]}
          </div>
        );
      },
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      width: 180,
      render: (text: number) => {
        return <div>{text.toLocaleString()}đ</div>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 400,
      render: (_: unknown, data: IOrder) => {
        return (
          <div className="min-w-[200px] flex justify-center">
            <Button className="mr-3" onClick={() => handleEditOrder(data?.id)}>
              Xem
            </Button>
            <UpdateOrderStatusModal
              orderId={data?.id}
              refetch={refetch}
              currentStatus={String(data?.order_status)}
            />
            <CancelOrderModal
              orderId={data?.id}
              refetch={refetch}
              currentStatus={String(data?.order_status)}
            />
          </div>
        );
      },
    },
  ];

  const handleEditOrder = (id: string) => {
    navigate(`/orders/${id}`);
  };

  return (
    <div>
      <Header>Quản lý orders</Header>

      <TableCommon
        columns={columnsOrder}
        dataSource={isSuccess ? data?.data?.orders : []}
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
    </div>
  );
};

export default Orders;
