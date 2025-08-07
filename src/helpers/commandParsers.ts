import { logger } from '../logger/logger';
import { Birthday } from '../repository/types';

export function parseAddCommand(
  text: string
): Pick<Birthday, 'name' | 'month' | 'day'> | null {
  // Expected format: "namePart1 namePartN #MM-DD"
  const parts = text.trim().split(/#/);
  if (parts.length !== 2) {
    logger.warn(`User input incorrect: ${text}`);
    return null;
  }

  const [namePart, datePart] = parts;
  const [month, day] = datePart.split(/-/);

  return { name: namePart.trim(), month: month.trim(), day: day.trim() };
}

export function parseRemoveCommand(text: string): string {
  return text.trim();
}
