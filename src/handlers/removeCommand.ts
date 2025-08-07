import { parseRemoveCommand } from '../helpers/commandParsers';
import logger from '../logger/logger';
import birthdayRepository from '../repository/dynamodb';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../slackInterface/responses';
import { SlackCommand } from '../types';

async function handleRemoveCommand(command: SlackCommand) {
  logger.info('Triggered handleRemoveCommand');
  const name = parseRemoveCommand(command.text);
  if (!name) {
    return createErrorResponse(
      'Invalid format. Use `/remove name`, name cannot be empty'
    );
  }

  try {
    const birthdayRecordExist = await birthdayRepository.findByKey(
      command.userId,
      name
    );
    if (!birthdayRecordExist) {
      return createSuccessResponse(`🫠 Birthday for ${name} does not exist...`);
    }
    logger.info('Name exists in database, proceeding with deletion');

    await birthdayRepository.delete(command.userId, name);
    return createSuccessResponse(`🚯 Deleted ${name}'s birthday`);
  } catch (error) {
    logger.error('Error removing birthday', error);
    return createErrorResponse('Failed to remove birthday. Please try again.');
  }
}

export default handleRemoveCommand;
