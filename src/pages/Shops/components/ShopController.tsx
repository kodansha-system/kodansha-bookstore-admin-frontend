import { Form, Input, Modal, Upload, Image, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";
import { useEffect, useState } from "react";
import { IShop } from "@/models";
import { Action } from "@/enum/actions";
import { FileType, getBase64 } from "@/utils/file";
import { useCreateShop, useDetailShop, useEditShop } from "@/hooks/shops";
import TiptapEditor from "@/pages/Articles/components/TiptapEditor";
import { useDistricts, useProvinces, useWards } from "@/hooks/addresses";

interface IProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "add" | "edit";
  id?: string;
}

const ShopController = ({ isOpen, setIsOpen, mode, id }: IProps) => {
  const [form] = Form.useForm();
  const createShop = useCreateShop();
  const editShop = useEditShop();
  const { data } = useDetailShop(id || "");

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { data: listProvince, isFetching: isFetchingProvinces } =
    useProvinces();
  const provinceId = Form.useWatch("province_id", form);
  const districtId = Form.useWatch("district_id", form);
  const { data: listDistrict, isFetching: isFetchingDistricts } = useDistricts({
    province_id: provinceId,
  });
  const { data: listWard, isFetching: isFetchingWards } = useWards({
    district_id: districtId,
  });

  const handleSubmit = async (values: IShop) => {
    try {
      const data = await form.validateFields();
      console.log("Form Data: ", data);
      if (fileList.length === 0) {
        setImageError(true);
        return;
      } else {
        setImageError(false);
      }

      setIsLoading(true);
      const image = fileList[0]?.originFileObj as File | undefined;

      if (mode === Action.ADD) {
        await createShop.mutateAsync({ ...values, image });
      } else if (mode === "edit" && id) {
        await editShop.mutateAsync({ ...values, id, image });
      }

      setIsOpen(false);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setImageError(newFileList.length === 0);
  };

  useEffect(() => {
    if (isOpen && mode === "edit" && data) {
      const shop = data?.data;
      form.setFieldsValue({
        name: shop?.name,
        address: shop?.address,
        province_id: shop?.province_id,
        district_id: shop?.district_id,
        ward_id: +shop?.ward_id,
        phone: shop?.phone,
        working_time: shop?.working_time,
        google_map_url: shop?.google_map_url,
        description: shop?.description,
      });
      if (shop?.image) {
        setFileList([{ uid: "", name: shop?.name, url: shop?.image }]);
      }
    }
  }, [isOpen, mode, data, form]);

  return (
    <Modal
      open={isOpen}
      title={mode === "add" ? "Thêm shop" : "Sửa shop"}
      okText={mode === "add" ? "Tạo" : "Sửa"}
      cancelText="Hủy"
      onCancel={() => setIsOpen(false)}
      destroyOnClose
      afterClose={() => {
        setIsLoading(false);
        setFileList([]);
        setPreviewImage("");
        setImageError(false);
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
        label="Địa chỉ"
        name="address"
        rules={[{ required: true, message: "Địa chỉ không được để trống" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Tỉnh/Thành phố"
        name="province_id"
        rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành" }]}
      >
        <Select
          options={listProvince}
          onChange={() => {
            form.setFieldsValue({ district_id: undefined, ward_id: undefined });
          }}
          loading={isFetchingProvinces}
          disabled={isFetchingProvinces}
        />
      </Form.Item>

      <Form.Item
        label="Quận/Huyện"
        name="district_id"
        rules={[{ required: true, message: "Vui lòng chọn quận/huyện" }]}
      >
        <Select
          options={listDistrict}
          onChange={() => {
            form.setFieldsValue({ ward_id: undefined });
          }}
          loading={isFetchingDistricts}
          disabled={isFetchingDistricts}
        />
      </Form.Item>

      <Form.Item
        label="Phường/Xã"
        name="ward_id"
        rules={[
          {
            required: listWard?.length > 0,
            message: "Vui lòng chọn phường/xã",
          },
        ]}
      >
        <Select
          options={listWard}
          loading={isFetchingWards}
          disabled={isFetchingWards}
        />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          { required: true, message: "Số điện thoại không được để trống" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Thời gian làm việc"
        name="working_time"
        rules={[
          { required: true, message: "Thời gian làm việc không được để trống" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Google Map URL"
        name="google_map_url"
        rules={[{ required: true, message: "Vui lòng nhập link bản đồ" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Mô tả không được để trống" }]}
      >
        <TiptapEditor
          value={form.getFieldValue("description")}
          onChange={(description: any) => form.setFieldsValue({ description })}
        />
      </Form.Item>

      <Form.Item label="Ảnh shop">
        <Upload
          beforeUpload={() => false}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          maxCount={1}
        >
          {fileList.length >= 1 ? null : (
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          )}
        </Upload>
        {imageError && (
          <div style={{ color: "red", fontSize: 12 }}>
            Vui lòng chọn một ảnh
          </div>
        )}
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Form.Item>
    </Modal>
  );
};

export default ShopController;
