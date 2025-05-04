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
