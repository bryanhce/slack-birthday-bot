import { parseRemoveCommand } from '../helpers/commandParsers';
import { logger } from '../logger/logger';
import { repository } from '../repository/dynamodb';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../responses/responses';
import { SlackCommand } from '../types';

async function handleRemoveCommand(command: SlackCommand) {
  const name = parseRemoveCommand(command.text);
  if (!name) {
    return createErrorResponse(
      'Invalid format. Use `/remove name`, name cannot be empty'
    );
  }

  try {
    const birthdayRecordExist = await repository.getBirthday(
      command.user_id,
      name
    );
    if (!birthdayRecordExist) {
      return createSuccessResponse(`🫠 Birthday for ${name} is does not exist`);
    }

    await repository.removeBirthday(command.user_id, name);
    return createSuccessResponse(`🚯 Deleted ${name}'s birthday`);
  } catch (error) {
    logger.error('Error removing birthday', error);
    return createErrorResponse('Failed to remove birthday. Please try again.');
  }
}

export default handleRemoveCommand;
