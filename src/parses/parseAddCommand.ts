export function parseAddCommand(
  text: string,
): { name: string; date: string } | null {
  // Expected format: "namePart1 namePartN #MM-DD"
  const parts = text.trim().split(/\#/);
  if (parts.length !== 2) return null;

  const [namePart, datePart] = parts;

  if (!isValidDate(datePart)) return null;

  return { name: namePart, date: datePart };
}

export function isValidDate(dateString: string): boolean {
  const regex = /^\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
