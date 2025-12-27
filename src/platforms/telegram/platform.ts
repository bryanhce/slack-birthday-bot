import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import sendTelegramMessage from './sendMessage';
import verifyTelegramRequest from './verifyRequest';
import { createErrorResponse, createSuccessResponse } from './responses';
import { BotCommand } from '../types';
import Platform from '../platform';

/* eslint-disable class-methods-use-this */
class TelegramPlatform extends Platform {
  constructor();

  constructor(channelId: string);

  constructor(channelId?: string) {
    super();
    if (channelId) {
      this.channelId = channelId;
    }
  }

  parseCommand(event: APIGatewayProxyEvent): BotCommand {
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const update = JSON.parse(event.body);

    const message = update.message || update.edited_message;
    if (!message) {
      throw new Error('Invalid Telegram update format: missing message');
    }

    const chatId = message.chat?.id?.toString() || '';
    const userId = message.from?.id?.toString() || '';
    const userName = message.from?.username || message.from?.first_name || '';
    const text = message.text || '';

    // Extract command from text (e.g., "/add" or "/list-all")
    const commandMatch = text.match(/^\/(\S+)/);
    const command = commandMatch ? `/${commandMatch[1]}` : '';
    const commandText = text.replace(/^\/(\S+)\s*/, '').trim();

    return {
      userId,
      userName,
      command,
      text: commandText,
      channelId: chatId,
    };
  }

  async sendMessage(message: string): Promise<void> {
    if (!this.channelId) {
      throw new Error('ChannelId must be set before sending messages');
    }
    await sendTelegramMessage(message, this.channelId);
  }

  verifyRequest(request: APIGatewayProxyEvent): void {
    verifyTelegramRequest(request);
  }

  async createErrorResponse(message: string): Promise<APIGatewayProxyResult> {
    await this.sendMessage(message);
    return createErrorResponse(message);
  }

  async createSuccessResponse(message: string): Promise<APIGatewayProxyResult> {
    await this.sendMessage(message);
    return createSuccessResponse(message);
  }
}

export default TelegramPlatform;
