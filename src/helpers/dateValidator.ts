export function isValidDate(dateString: string): boolean {
  const regex = /^\d{2}-\d{2}$/; // TODO double check if this validation is sufficient
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
