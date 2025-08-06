const dateToday = (): string => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(today.getDate()).padStart(2, '0');

  return `${mm}-${dd}`;
};

export default dateToday;
