import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { SlackCommand } from './types';
import handleAddCommand from './handlers/addCommand';
import { createErrorResponse } from './responses/responses';
import handleListCommand from './handlers/listCommand';
import handleRemoveCommand from './handlers/removeCommand';

// TODO add proper logging
async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const params = new URLSearchParams(event.body!);
    const command: SlackCommand = {
      user_id: params.get('user_id') || '',
      user_name: params.get('user_name') || '',
      command: params.get('command') || '',
      text: params.get('text') || '',
    };

    switch (command.command) {
      case '/add':
        return await handleAddCommand(command);
      case '/list-all':
        return await handleListCommand(command);
      case '/remove-bday':
        return await handleRemoveCommand(command);
      default:
        return createErrorResponse('Unknown command');
    }
  } catch (error) {
    console.error('Error in slackCommand:', error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
}

export default handler;
