import { logger } from '../logger/logger';

const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function isValidMonthDayCombination(month: number, day: number): boolean {
  return day <= daysInMonth[month - 1];
}

function isValidDate(dateString: string): boolean {
  const regex = /^\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    logger.warn(`Invalid date format: ${dateString}`);
    return false;
  }

  const [monthStr, dayStr] = dateString.split('-');
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    logger.warn(`Date failed range check: ${dateString}`);
    return false;
  }

  if (!isValidMonthDayCombination(month, day)) {
    logger.warn(`Invalid MM-DD combination: ${dateString}`);
    return false;
  }

  return true;
}

export default isValidDate;
