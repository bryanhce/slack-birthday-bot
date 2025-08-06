import { Birthday } from '../types';
import isValidDate from './dateValidator';

export function parseAddCommand(
  text: string
): Omit<Birthday, 'user_id'> | null {
  // Expected format: "namePart1 namePartN #MM-DD"
  const parts = text.trim().split(/#/);
  if (parts.length !== 2) return null;

  const [namePart, datePart] = parts;

  if (!isValidDate(datePart)) return null;

  return { name: namePart.trim(), date: datePart.trim() };
}

export function parseRemoveCommand(text: string): string | null {
  return text.trim();
}
