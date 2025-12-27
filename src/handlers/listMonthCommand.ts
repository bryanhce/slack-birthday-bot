import { APIGatewayProxyResult } from 'aws-lambda';
import birthdayRepository from '../repository/dynamodb';
import { formatBirthtdaysByMonth } from '../helpers/formatBirthdayMessage';
import logger from '../logger/logger';
import dateToday from '../helpers/dateToday';
import { BotCommand } from '../platforms/types';
import Platform from '../platforms/platform';

const handleListMonthCommand = async (
  platform: Platform,
  command: BotCommand
): Promise<APIGatewayProxyResult> => {
  logger.info('Triggered handleListMonthCommand');
  const { userId } = command;
  const { month } = dateToday();

  try {
    const birthdayArr = await birthdayRepository.findByUserAndMonth(
      userId,
      month
    );
    if (birthdayArr.length === 0) {
      return await platform.createSuccessResponse(
        "🥸 You don't have any birthdays for this month!"
      );
    }
    return await platform.createSuccessResponse(
      formatBirthtdaysByMonth(birthdayArr)
    );
  } catch (error) {
    logger.error('Error listing monthly birthdays', error);
    return platform.createErrorResponse(
      "Failed to list this month's birthdays. Please try again."
    );
  }
};

export default handleListMonthCommand;
