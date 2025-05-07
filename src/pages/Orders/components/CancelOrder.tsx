import { useMemo, useState } from "react";
import { Modal, Button, Input, message } from "antd";
import instance from "@/services/apiRequest";
import { OrderStatus } from "@/utils/common";

const { TextArea } = Input;

interface CancelOrderModalProps {
  orderId: string;
  refetch: () => void;
  currentStatus: string;
}

const CancelOrderModal = ({
  orderId,
  refetch,
  currentStatus,
}: CancelOrderModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const handleCancel = async () => {
    if (!note.trim()) {
      message.warning("Vui lòng nhập lý do hủy đơn");
      return;
    }

    try {
      setLoading(true);
      await instance.post("/orders/cancel-order", { orderId, note });
      message.success("Đã hủy đơn hàng");
      setOpen(false);
      setNote("");
      refetch();
    } catch (err) {
      console.log(err);
      message.error("Hủy đơn hàng thất bại");
    } finally {
      setLoading(false);
    }
  };

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
        className="text-white bg-red-500 cursor-pointer py-[6px] px-3 rounded-md"
        onClick={() => setOpen(true)}
        disabled={orderCancelOrCompleted}
      >
        Hủy đơn hàng
      </Button>

      <Modal
        title="Bạn có chắc muốn hủy đơn?"
        open={open}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="back" onClick={() => setOpen(false)} disabled={loading}>
            Đóng
          </Button>,
          <Button
            key="submit"
            type="primary"
            danger
            loading={loading}
            onClick={handleCancel}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <p className="mb-3">
          Đơn hàng sẽ bị hủy và không thể khôi phục. Bạn có chắc không?
        </p>
        <TextArea
          rows={4}
          placeholder="Nhập lý do hủy đơn"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default CancelOrderModal;
