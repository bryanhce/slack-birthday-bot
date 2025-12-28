import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import logger from './logger/logger';
import handleAddCommand from './handlers/addCommand';
import handleListCommand from './handlers/listCommand';
import handleRemoveCommand from './handlers/removeCommand';
import handleListMonthCommand from './handlers/listMonthCommand';
import createPlatform from './platforms/factory';
import { BotCommand } from './platforms/types';
import PlatformVerificationError from './platforms/error';

async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const platform = createPlatform();
    platform.verifyRequest(event);
    const command: BotCommand = platform.parseCommand(event);
    logger.setContext({
      command: command.command,
      userName: command.userName,
      channelId: command.channelId,
      userId: command.userId,
    });
    platform.setChannelId(command.channelId);

    switch (command.command) {
      case '/add':
        return await handleAddCommand(platform, command);
      case '/listAll':
        return await handleListCommand(platform, command);
      case '/listMonth':
        return await handleListMonthCommand(platform, command);
      case '/remove':
        return await handleRemoveCommand(platform, command);
      default:
        logger.warn('No command');
        return await platform.createErrorResponse('Unknown command');
    }
  } catch (error) {
    if (error instanceof PlatformVerificationError) {
      logger.error('Error in platform verification', error);
      return {
        statusCode: 403,
        body: 'Reuquest Forbidden',
      };
    }

    logger.error('Error in command', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
}

export default handler;
