import { Birthday } from "../types";

export function parseAddCommand(
  text: string,
): Omit<Birthday, 'user_id'> | null {
  // Expected format: "namePart1 namePartN #MM-DD"
  const parts = text.trim().split(/\#/);
  if (parts.length !== 2) return null;

  const [namePart, datePart] = parts;

  if (!isValidDate(datePart)) return null;

  return { name: namePart.trim(), date: datePart.trim() };
}

export function parseRemoveCommand(text: string): string | null {
  return text.trim();
}

// TODO move out of this function if it is being used in other places
export function isValidDate(dateString: string): boolean {
  const regex = /^\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}
