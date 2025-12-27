import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import sendSlackMessage from './sendMessage';
import verifySlackRequest from './verifyRequest';
import { createErrorResponse, createSuccessResponse } from './responses';
import { BotCommand } from '../types';
import Platform from '../platform';

// Left the other fields in the event we might want to use in the future
export type SlackCommand = {
  userId: string;
  userName: string;
  command: string;
  text: string;
  channelId: string;
  // token: string;
  // teamId: string;
  // teamDomain: string;
  // channelName: string;
  // responseUrl: string;
  // triggerId: string;
};

/* eslint-disable class-methods-use-this */
class SlackPlatform extends Platform {
  // overloading constructors
  constructor();

  constructor(channelId: string);

  // implementation of constructure
  // Parameters must be compatible with ALL signatures above
  constructor(channelId?: string) {
    super();
    if (channelId) {
      this.channelId = channelId;
    }
  }

  parseCommand(event: APIGatewayProxyEvent): BotCommand {
    const params = new URLSearchParams(event.body!);
    const command: BotCommand = {
      userId: params.get('user_id') || '',
      userName: params.get('user_name') || '',
      command: params.get('command') || '',
      text: params.get('text') || '',
      channelId: params.get('channel_id') || '',
    };
    return command;
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.channelId) {
      throw new Error('ChannelId must be set before sending messages');
    }
    await sendSlackMessage(message, this.channelId);
  }

  verifyRequest(request: APIGatewayProxyEvent): void {
    verifySlackRequest(request);
  }

  async createErrorResponse(message: string): Promise<APIGatewayProxyResult> {
    return createErrorResponse(message);
  }

  async createSuccessResponse(message: string): Promise<APIGatewayProxyResult> {
    return createSuccessResponse(message);
  }
}

export default SlackPlatform;
