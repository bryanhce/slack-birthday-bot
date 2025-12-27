import { APIGatewayProxyEvent } from 'aws-lambda';

import ENV from '../../env';
import TelegramVerificationError from './error';
import logger from '../../logger/logger';

/**
 * Verifies that the incoming request is a genuine request from Telegram.
 * Telegram webhooks can optionally use a secret token for verification.
 * Throws an error if verification fails.
 * @param {APIGatewayProxyEvent} event The Lambda event object.
 */
function verifyTelegramRequest(event: APIGatewayProxyEvent): void {
  // Telegram sends webhook updates as JSON in the body
  if (!event.body) {
    throw new TelegramVerificationError(
      'Missing request body. Request is not from Telegram.'
    );
  }

  let update;
  try {
    update = JSON.parse(event.body);
  } catch (error) {
    throw new TelegramVerificationError(
      'Invalid JSON in request body. Request is not from Telegram.'
    );
  }

  // Verify the update structure
  if (!update || typeof update !== 'object') {
    throw new TelegramVerificationError(
      'Invalid update structure. Request is not from Telegram.'
    );
  }

  // Optional: Verify secret token if configured
  // Telegram allows setting a secret token when setting up webhooks
  // This can be passed via headers (case-insensitive in API Gateway)
  const secretToken =
    event.headers['X-Telegram-Bot-Api-Secret-Token'] ||
    event.headers['x-telegram-bot-api-secret-token'];

  if (!secretToken) {
    throw new TelegramVerificationError(
      'Missing Telegram secret token header. Request is not from Telegram.'
    );
  }
  if (secretToken !== ENV.TELEGRAM_SECRET_TOKEN) {
    throw new TelegramVerificationError(
      'Telegram secret token verification failed.'
    );
  }

  logger.info('Verified that request is from Telegram');
}

export default verifyTelegramRequest;
