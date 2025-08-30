export const formatDateForDisplay = (date: Date) => {
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일 | ${hours}:${minutes}`;
};

export const calculateDutchPayAmount = (price: number, dutchPayCount: number) => {
  if (dutchPayCount <= 1 || !price) return price.toLocaleString();
  return Math.floor(price / dutchPayCount).toLocaleString();
};
