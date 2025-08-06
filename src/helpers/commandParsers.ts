import { Birthday } from '../types';

export function parseAddCommand(
  text: string
): Omit<Birthday, 'user_id'> | null {
  // Expected format: "namePart1 namePartN #MM-DD"
  const parts = text.trim().split(/#/);
  if (parts.length !== 2) return null;

  const [namePart, datePart] = parts;

  return { name: namePart.trim(), date: datePart.trim() };
}

export function parseRemoveCommand(text: string): string | null {
  return text.trim();
}
