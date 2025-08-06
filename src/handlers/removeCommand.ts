import { parseRemoveCommand } from '../helpers/commandParsers';
import { logger } from '../logger/logger';
import { repository } from '../repository/dynamodb';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../responses/responses';
import { SlackCommand } from '../types';

async function handleRemoveCommand(command: SlackCommand) {
  const parsed = parseRemoveCommand(command.text);
  if (!parsed) {
    return createErrorResponse(
      'Invalid format. Use `/remove name`, name cannot be empty'
    );
  }

  try {
    await repository.removeBirthday(command.user_id, parsed);
    return createSuccessResponse(`🚯 Deleted ${parsed}'s birthday`);
  } catch (error) {
    logger.error('Error removing birthday', error);
    return createErrorResponse('Failed to remove birthday. Please try again.');
  }
}

export default handleRemoveCommand;
