type DateType = {
  month: string;
  day: string;
};

const dateToday = (): DateType => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(today.getDate()).padStart(2, '0');

  return { month, day };
};

export default dateToday;
