import { APIGatewayProxyResult } from 'aws-lambda';
import birthdayRepository from '../repository/dynamodb';
import { formatBirthtdaysByMonth } from '../helpers/formatBirthdayMessage';
import logger from '../logger/logger';
import { BotCommand } from '../platforms/types';
import Platform from '../platforms/platform';

const handleListCommand = async (
  platform: Platform,
  command: BotCommand
): Promise<APIGatewayProxyResult> => {
  logger.info('Triggered handleListCommand');
  const { userId } = command;

  try {
    const birthdayArr = await birthdayRepository.findAllByUserId(userId);
    if (birthdayArr.length === 0) {
      return await platform.createSuccessResponse(
        "🥸 You don't have any birthday records!"
      );
    }
    return await platform.createSuccessResponse(
      formatBirthtdaysByMonth(birthdayArr)
    );
  } catch (error) {
    logger.error('Error listing birthdays', error);
    return platform.createErrorResponse(
      'Failed to list birthdays. Please try again.'
    );
  }
};

export default handleListCommand;
