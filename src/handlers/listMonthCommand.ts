import birthdayRepository from '../repository/dynamodb';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../slackInterface/responses';
import { SlackCommand } from '../types';
import { formatBirthtdaysByMonth } from '../helpers/formatBirthdayMessage';
import logger from '../logger/logger';
import dateToday from '../helpers/dateToday';

async function handleListMonthCommand(command: SlackCommand) {
  logger.info('Triggered handleListMonthCommand');
  const { userId } = command;
  const { month } = dateToday();

  try {
    const birthdayArr = await birthdayRepository.findByUserAndMonth(
      userId,
      month
    );
    if (birthdayArr.length === 0) {
      return createSuccessResponse(
        "🥸 You don't have any birthdays for this month!"
      );
    }
    return createSuccessResponse(formatBirthtdaysByMonth(birthdayArr));
  } catch (error) {
    logger.error('Error listing monthly birthdays', error);
    return createErrorResponse(
      "Failed to list this month's birthdays. Please try again."
    );
  }
}

export default handleListMonthCommand;
