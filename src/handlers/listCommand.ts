import { repository } from '../repository/dynamodb';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../slackInterface/responses';
import { SlackCommand } from '../types';
import { formatBirthtdaysByMonth } from '../helpers/formatBirthdayMessage';
import { logger } from '../logger/logger';

async function handleListCommand(command: SlackCommand) {
  const userId = command.user_id;

  try {
    const birthdayArr = await repository.getAllBirthdays(userId);
    if (birthdayArr.length === 0)
      return createSuccessResponse("🥸 You don't have any birthday records!");
    return createSuccessResponse(formatBirthtdaysByMonth(birthdayArr));
  } catch (error) {
    logger.error('Error listing birthdays', error);
    return createErrorResponse('Failed to list birthdays. Please try again.');
  }
}

export default handleListCommand;
