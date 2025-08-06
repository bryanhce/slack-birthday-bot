function isValidDate(dateString: string): boolean {
  const regex = /^\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date;
}

export default isValidDate;
