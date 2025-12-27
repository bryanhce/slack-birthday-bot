import { APIGatewayProxyResult } from 'aws-lambda';
import { parseRemoveCommand } from '../helpers/commandParsers';
import logger from '../logger/logger';
import birthdayRepository from '../repository/dynamodb';
import { BotCommand } from '../platforms/types';
import Platform from '../platforms/platform';

const handleRemoveCommand = async (
  platform: Platform,
  command: BotCommand
): Promise<APIGatewayProxyResult> => {
  logger.info('Triggered handleRemoveCommand');
  const name = parseRemoveCommand(command.text);
  if (!name) {
    return platform.createErrorResponse(
      'Invalid format. Use `/remove name`, name cannot be empty'
    );
  }

  try {
    const birthdayRecordExist = await birthdayRepository.findByKey(
      command.userId,
      name
    );
    if (!birthdayRecordExist) {
      return await platform.createSuccessResponse(
        `🫠 Birthday for ${name} does not exist...`
      );
    }
    logger.info('Name exists in database, proceeding with deletion');

    await birthdayRepository.delete(command.userId, name);
    return await platform.createSuccessResponse(
      `🚯 Deleted ${name}'s birthday`
    );
  } catch (error) {
    logger.error('Error removing birthday', error);
    return platform.createErrorResponse(
      'Failed to remove birthday. Please try again.'
    );
  }
};

export default handleRemoveCommand;
