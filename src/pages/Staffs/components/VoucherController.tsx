import {
  Form,
  Input,
  Modal,
  InputNumber,
  Select,
  Switch,
  DatePicker,
} from "antd";
import { useEffect, useState } from "react";

import { IVoucher } from "@/models";
import { Action } from "@/enum/actions";
import {
  useCreateVoucher,
  useDetailVoucher,
  useEditVoucher,
} from "@/hooks/vouchers";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "add" | "edit";
  id?: string;
}

const VoucherController = ({ isOpen, setIsOpen, mode, id }: IProps) => {
  const [form] = Form.useForm();
  const createVoucher = useCreateVoucher();
  const editVoucher = useEditVoucher();
  const { data } = useDetailVoucher(id || "");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: IVoucher) => {
    try {
      const data = await form.validateFields();
      console.log("Form Data: ", data);

      setIsLoading(true);

      if (mode === Action.ADD) {
        await createVoucher.mutateAsync({ ...values });
      } else if (mode === "edit" && id) {
        await editVoucher.mutateAsync({ ...values, id });
      }

      setIsOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && mode === "edit" && data) {
      const article = data?.data;
      form.setFieldsValue({
        title: article?.title,
        status: article?.status,
        content: article?.content,
      });
    }
  }, [isOpen, mode, data, form]);

  return (
    <Modal
      open={isOpen}
      title={mode === "add" ? "Thêm voucher" : "Sửa voucher"}
      okText={mode === "add" ? "Tạo" : "Sửa"}
      cancelText="Hủy"
      onCancel={() => setIsOpen(false)}
      destroyOnClose
      afterClose={() => {
        setIsLoading(false);
        form.resetFields();
      }}
      modalRender={(dom) => (
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {dom}
        </Form>
      )}
      onOk={() => form.submit()}
      confirmLoading={isLoading}
      maskClosable={false}
    >
      <Form.Item
        label="Mã voucher"
        name="code"
        rules={[{ required: true, message: "Mã voucher không được để trống" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Mô tả không được để trống" }]}
      >
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        label="Thời gian bắt đầu"
        name="start_time"
        rules={[{ required: true, message: "Chọn thời gian bắt đầu" }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item
        label="Thời gian kết thúc"
        name="end_time"
        rules={[{ required: true, message: "Chọn thời gian kết thúc" }]}
      >
        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <Form.Item
        label="Phần trăm giảm giá"
        name="discount_percent"
        rules={[
          { required: true, message: "Nhập phần trăm giảm giá" },
          {
            type: "number",
            min: 0,
            max: 100,
            message: "Phần trăm phải từ 0 đến 100",
          },
        ]}
      >
        <InputNumber min={0} max={100} formatter={(value) => `${value}%`} />
      </Form.Item>
      <Form.Item
        label="Giảm giá tối đa"
        name="max_discount"
        rules={[{ required: true, message: "Nhập giảm giá tối đa" }]}
        className="w-full w-400"
      >
        <InputNumber
          min={0}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => (value ?? "").replace(/[,VNĐ\s]/g, "")}
          className="w-full"
          prefix="VNĐ"
        />
      </Form.Item>
      <Form.Item
        label="Giá trị đơn hàng tối thiểu"
        name="min_order_total_price"
        rules={[
          { required: true, message: "Nhập giá trị tối thiểu của đơn hàng" },
        ]}
        className="w-full"
      >
        <InputNumber
          min={0}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => (value ?? "").replace(/[,VNĐ\s]/g, "")}
          className="w-full"
          prefix="VNĐ"
        />
      </Form.Item>
      <Form.Item
        label="Loại voucher"
        name="type"
        rules={[{ required: true, message: "Chọn loại voucher" }]}
      >
        <Select>
          <Select.Option value="discount">Giảm giá</Select.Option>
          <Select.Option value="free_ship">Freeship</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Số lượng"
        name="quantity"
        rules={[{ required: true, message: "Nhập số lượng" }]}
      >
        <InputNumber min={1} />
      </Form.Item>
    </Modal>
  );
};

export default VoucherController;
