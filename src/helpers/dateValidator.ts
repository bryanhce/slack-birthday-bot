import { logger } from '../logger/logger';

const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isValidMonthDayCombination(month: number, day: number): boolean {
  return day <= daysInMonth[month - 1];
}

function isValidDate(monthStr: string, dayStr: string): boolean {
  const regex = /^\d{2}-\d{2}$/;
  const dateStr = `${monthStr}-${dayStr}`;
  if (!regex.test(dateStr)) {
    logger.warn(`Invalid date format: ${dateStr}`);
    return false;
  }

  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    logger.warn(`Date failed range check: ${dateStr}`);
    return false;
  }

  if (!isValidMonthDayCombination(month, day)) {
    logger.warn(`Invalid MM-DD combination: ${dateStr}`);
    return false;
  }

  return true;
}

export default isValidDate;
