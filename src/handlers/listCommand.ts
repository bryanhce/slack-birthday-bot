import { repository } from '../repository/dynamodb';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../responses/responses';
import { SlackCommand } from '../types';
import formatBirthtdays from '../helpers/formatBulkBirthdays';
import { logger } from '../logger/logger';

async function handleListCommand(command: SlackCommand) {
  const userId = command.user_id;

  try {
    const brithdayArray = await repository.getAllBirthdays(userId);
    return createSuccessResponse(formatBirthtdays(brithdayArray));
  } catch (error) {
    logger.error('Error listing birthdays', error);
    return createErrorResponse('Failed to list birthdays. Please try again.');
  }
}

export default handleListCommand;
