import { APIGatewayProxyResult } from 'aws-lambda';
import { parseAddCommand } from '../helpers/commandParsers';
import isValidDate from '../helpers/dateValidator';
import logger from '../logger/logger';
import birthdayRepository from '../repository/dynamodb';
import { Birthday } from '../repository/types';
import { BotCommand } from '../platforms/types';
import Platform from '../platforms/platform';

const handleAddCommand = async (
  platform: Platform,
  command: BotCommand
): Promise<APIGatewayProxyResult> => {
  logger.info('Triggered handleAddCommand');
  const parsed = parseAddCommand(command.text);
  if (!parsed) {
    return platform.createErrorResponse(
      'Invalid format. Use `/add name #MM-DD`'
    );
  }

  const { name, month, day } = parsed;
  if (!isValidDate(month, day)) {
    return platform.createErrorResponse('Invalid birthday date. Follow #MM-DD');
  }

  const existing = await birthdayRepository.findByKey(command.userId, name);
  if (existing) {
    return platform.createErrorResponse(
      `Birthday for ${name} is already registered.`
    );
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
    await birthdayRepository.upsert(birthday);
    return await platform.createSuccessResponse(
      `🎉 ${name}'s birthday has been added for ${month}-${day}!`
    );
  } catch (error) {
    logger.error('Error adding birthday', error);
    return platform.createErrorResponse(
      'Failed to add birthday. Please try again.'
    );
  }
};

export default handleAddCommand;
