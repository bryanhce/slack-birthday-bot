import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BotCommand } from './types';

abstract class Platform {
  protected channelId: string | null = null;

  abstract parseCommand(event: APIGatewayProxyEvent): BotCommand;
  abstract sendMessage(message: string): Promise<void>;
  abstract verifyRequest(request: APIGatewayProxyEvent): void;
  abstract createErrorResponse(message: string): Promise<APIGatewayProxyResult>;
  abstract createSuccessResponse(
    message: string
  ): Promise<APIGatewayProxyResult>;

  setChannelId(channelId: string): void {
    this.channelId = channelId;
  }
}

export default Platform;
