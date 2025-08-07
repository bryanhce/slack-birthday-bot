import { parseAddCommand } from '../helpers/commandParsers';
import isValidDate from '../helpers/dateValidator';
import { logger } from '../logger/logger';
import { repository } from '../repository/dynamodb';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../slackInterface/responses';
import { SlackCommand } from '../types';
import { Birthday } from '../repository/types';

const handleAddCommand = async (command: SlackCommand) => {
  logger.info('Triggered handleAddCommand');
  const parsed = parseAddCommand(command.text);
  if (!parsed) {
    return createErrorResponse('Invalid format. Use `/add name #MM-DD`');
  }

  const { name, month, day } = parsed;
  if (!isValidDate(month, day)) {
    return createErrorResponse('Invalid birthday date. Follow #MM-DD');
  }

  const existing = await repository.getBirthday(command.userId, name);
  if (existing) {
    return createErrorResponse(`Birthday for ${name} is already registered.`);
  }
  logger.info('Name does not exist in database, proceeding with insertion');

  const birthday: Birthday = {
    name,
    userId: command.userId,
    month,
    day,
    userName: command.userName,
    channelId: command.channelId,
  };

  try {
    await repository.addBirthday(birthday);
    return createSuccessResponse(
      `🎉 ${name}'s birthday has been added for ${month}-${day}!`
    );
  } catch (error) {
    logger.error('Error adding birthday', error);
    return createErrorResponse('Failed to add birthday. Please try again.');
  }
};

export default handleAddCommand;
