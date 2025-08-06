import { parseAddCommand } from '../helpers/commandParsers';
import isValidDate from '../helpers/dateValidator';
import { logger } from '../logger/logger';
import { repository } from '../repository/dynamodb';
import {
  createErrorResponse,
  createSuccessResponse,
} from '../slackInterface/responses';
import { Birthday, SlackCommand } from '../types';

const handleAddCommand = async (command: SlackCommand) => {
  const parsed = parseAddCommand(command.text);
  if (!parsed) {
    return createErrorResponse('Invalid format. Use `/add name #MM-DD`');
  }

  const { date, name } = parsed;
  if (!isValidDate(date)) {
    return createErrorResponse('Invalid birthday date. Follow #MM-DD');
  }

  const existing = await repository.getBirthday(command.user_id, name);
  if (existing) {
    return createErrorResponse(`Birthday for ${name} is already registered.`);
  }

  const birthday: Birthday = {
    name,
    user_id: command.user_id,
    date,
  };

  try {
    await repository.addBirthday(birthday);
    return createSuccessResponse(
      `🎉 ${name}'s birthday has been added for ${date}!`
    );
  } catch (error) {
    logger.error('Error adding birthday', error);
    return createErrorResponse('Failed to add birthday. Please try again.');
  }
};

export default handleAddCommand;
