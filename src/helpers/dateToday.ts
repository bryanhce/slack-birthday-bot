type DateType = {
  month: string;
  day: string;
};
/**
 * @returns [month, day]
 */
const dateToday = (): DateType => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const dd = String(today.getDate()).padStart(2, '0');

  return { month: mm, day: dd };
};

export default dateToday;
