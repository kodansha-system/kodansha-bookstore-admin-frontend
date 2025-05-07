import dayjs from "dayjs";

const normalizeString = (str: any) => {
  return str
    .toLowerCase()
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export const filterOptions = (input: any, option: any) => {
  // Chuẩn hóa input và label
  const normalizedInput = normalizeString(input);
  const normalizedLabel = normalizeString(option?.label ?? "");

  // Kiểm tra xem label có chứa input hay không
  if (normalizedLabel.includes(normalizedInput)) {
    return true;
  }

  // Tìm kiếm theo chữ cái đầu của mỗi từ trong label
  const labelWords = normalizedLabel.split(" ");
  let inputIndex = 0;
  for (let i = 0; i < labelWords.length; i++) {
    const word = labelWords[i];

    if (word[0] === normalizedInput[inputIndex]) {
      inputIndex++;
      if (inputIndex === normalizedInput.length) {
        return true;
      }
    } else {
      inputIndex = 0;
    }
  }

  return false;
};

export enum OrderStatus {
  New = 1,
  Verified = 900,
  WaitingPickup = 901,
  PickingUp = 902,
  PickedUp = 903,
  Delivering = 904,
  Delivered = 905,
  DeliveryFailed = 906,
  Returning = 907,
  Returned = 908,
  Reconciled = 909,
  CustomerReconciled = 910,
  CodTransferred = 911,
  WaitingCodPayment = 912,
  Completed = 913,
  Cancelled = 914,
  Delay = 915,
  PartiallyDelivered = 916,
  Error = 1000,
}

export const OrderStatusText: Record<OrderStatus, string> = {
  [OrderStatus.New]: "Đơn mới",
  [OrderStatus.Verified]: "Đã xác minh",
  [OrderStatus.WaitingPickup]: "Chờ lấy hàng",
  [OrderStatus.PickingUp]: "Lấy hàng",
  [OrderStatus.PickedUp]: "Đã lấy hàng",
  [OrderStatus.Delivering]: "Giao hàng",
  [OrderStatus.Delivered]: "Giao thành công",
  [OrderStatus.DeliveryFailed]: "Giao thất bại",
  [OrderStatus.Returning]: "Đang chuyển hoàn",
  [OrderStatus.Returned]: "Chuyển hoàn",
  [OrderStatus.Reconciled]: "Đã đối soát",
  [OrderStatus.CustomerReconciled]: "Đã đối soát khách",
  [OrderStatus.CodTransferred]: "Đã trả COD cho khách",
  [OrderStatus.WaitingCodPayment]: "Chờ thanh toán COD",
  [OrderStatus.Completed]: "Hoàn thành",
  [OrderStatus.Cancelled]: "Đơn hủy",
  [OrderStatus.Delay]: "Chậm lấy/giao",
  [OrderStatus.PartiallyDelivered]: "Giao hàng một phần",
  [OrderStatus.Error]: "Đơn lỗi",
};

export const orderStatusOptions = Object.entries(OrderStatusText).map(
  ([key, label]) => ({
    label,
    value: String(key),
  })
);

export enum PAY_METHODS {
  ONLINE = "online",
  OFFLINE = "offline",
}

export const PaymentMethodText: Record<PAY_METHODS, string> = {
  [PAY_METHODS.OFFLINE]: "Thanh toán khi nhận hàng",
  [PAY_METHODS.ONLINE]: "Thanh toán online",
};

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export const PaymentStatusText: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.SUCCESS]: "Đã thanh toán",
  [PaymentStatus.FAILED]: "Chưa thanh toán / Thanh toán lỗi",
};

export const DATE_FORMAT = {
  DAY_AND_TIME: "DD/MM/YYYY HH:mm:ss",
};

export const disabledDate = (current: dayjs.Dayjs) => {
  return current && current < dayjs().startOf("day");
};

export const disabledRangeTime = (_: any, type: "start" | "end") => {
  const now = dayjs();

  if (type === "start") {
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => (i < now.hour() ? i : -1)).filter(
          (i) => i !== -1
        ),
      disabledMinutes: (hour: number) =>
        hour === now.hour()
          ? Array.from({ length: 60 }, (_, i) =>
              i < now.minute() ? i : -1
            ).filter((i) => i !== -1)
          : [],
    };
  }
  return {};
};
