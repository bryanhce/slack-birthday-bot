import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { SlackCommand } from './types';
import { createErrorResponse } from './slackInterface/responses';
import logger from './logger/logger';
import handleAddCommand from './handlers/addCommand';
import handleListCommand from './handlers/listCommand';
import handleRemoveCommand from './handlers/removeCommand';
import handleListMonthCommand from './handlers/listMonthCommand';
import verifySlackRequest from './slackInterface/verifyRequest';
import SlackVerificationError from './slackInterface/error';

async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    verifySlackRequest(event);

    const params = new URLSearchParams(event.body!);
    const command: SlackCommand = {
      userId: params.get('user_id') || '',
      userName: params.get('user_name') || '',
      command: params.get('command') || '',
      text: params.get('text') || '',
      channelId: params.get('channel_id') || '',
    };
    logger.setContext({ command: command.command, userName: command.userName });

    switch (command.command) {
      case '/add':
        return await handleAddCommand(command);
      case '/list-all':
        return await handleListCommand(command);
      case '/list-month':
        return await handleListMonthCommand(command);
      case '/remove-bday':
        return await handleRemoveCommand(command);
      default:
        logger.warn('No command');
        return createErrorResponse('Unknown command');
    }
  } catch (error) {
    if (error instanceof SlackVerificationError) {
      logger.error('Error in Slack verification', error);
      return {
        statusCode: 403,
        body: 'Reuquest Forbidden',
      };
    }

    logger.error('Error in slackCommand', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
}

export default handler;
