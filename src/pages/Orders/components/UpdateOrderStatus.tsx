import { useEffect, useMemo, useState } from "react";
import { Modal, Button, Select, message } from "antd";
import { OrderStatus, orderStatusOptions } from "@/utils/common";
import instance from "@/services/apiRequest";

interface UpdateOrderStatusModalProps {
  orderId: string;
  currentStatus: string;
  refetch: () => void;
}

const UpdateOrderStatusModal = ({
  orderId,
  currentStatus,
  refetch,
}: UpdateOrderStatusModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newStatus, setNewStatus] = useState<string>(String(currentStatus));

  const handleUpdate = async () => {
    if (!newStatus) {
      message.warning("Vui lòng chọn trạng thái mới");
      return;
    }

    try {
      setLoading(true);
      await instance.patch("/orders/status/" + orderId, {
        status: Number(newStatus),
      });
      message.success("Cập nhật trạng thái thành công");
      setOpen(false);
      refetch();
    } catch (err) {
      message.error("Cập nhật trạng thái thất bại");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentStatus !== undefined) {
      setNewStatus(String(currentStatus));
    }
  }, [currentStatus]);

  const orderCancelOrCompleted = useMemo(() => {
    if (
      Number(currentStatus) === OrderStatus.Cancelled ||
      Number(currentStatus) === OrderStatus.Completed
    ) {
      return true;
    }
    return false;
  }, [currentStatus]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setNewStatus(String(currentStatus));
          setOpen(true);
        }}
        disabled={orderCancelOrCompleted}
        className="p-2 px-3 mr-3"
      >
        Cập nhật trạng thái
      </Button>

      <Modal
        title="Cập nhật trạng thái đơn hàng"
        open={open}
        onCancel={() => setOpen(false)}
        afterClose={() => setNewStatus("")}
        footer={[
          <Button
            key="cancel"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Đóng
          </Button>,
          <Button
            key="update"
            type="primary"
            loading={loading}
            onClick={handleUpdate}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <p className="mb-3">Chọn trạng thái mới cho đơn hàng:</p>
        <Select
          style={{ width: "100%" }}
          value={newStatus}
          onChange={setNewStatus}
          options={orderStatusOptions}
        />
      </Modal>
    </>
  );
};

export default UpdateOrderStatusModal;
