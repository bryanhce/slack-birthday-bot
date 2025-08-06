import { logger } from '../logger/logger';
import { Birthday } from '../types';

export function parseAddCommand(
  text: string
): Omit<Birthday, 'user_id'> | null {
  // Expected format: "namePart1 namePartN #MM-DD"
  const parts = text.trim().split(/#/);
  if (parts.length !== 2) {
    logger.warn(`User input incorrect: ${text}`);
    return null;
  }

  const [namePart, datePart] = parts;

  return { name: namePart.trim(), date: datePart.trim() };
}

export function parseRemoveCommand(text: string): string {
  return text.trim();
}
