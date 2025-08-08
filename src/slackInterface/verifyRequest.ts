import { APIGatewayProxyEvent } from 'aws-lambda';
import * as crypto from 'crypto';

import ENV from '../env';
import SlackVerificationError from './error';
import logger from '../logger/logger';

const signingSecret = ENV.SLACK_SIGNING_SECRET;
/**
 * Verifies that the incoming request is a genuine request from Slack.
 * Throws an error if verification fails.
 * @param {APIGatewayProxyEvent} event The Lambda event object.
 */
function verifySlackRequest(event: APIGatewayProxyEvent): void {
  const requestTimestamp = event.headers['X-Slack-Request-Timestamp'];
  const slackSignature = event.headers['X-Slack-Signature'];

  if (!requestTimestamp || !slackSignature) {
    throw new SlackVerificationError(
      'Missing Slack signature headers. Request is not from Slack.'
    );
  }

  // Check if the timestamp is more than 5 minutes old to prevent "replay attacks"
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(requestTimestamp, 10)) > 300) {
    throw new SlackVerificationError(
      'Slack request timestamp is too old. Possible replay attack.'
    );
  }

  // Create the "basestring" to be hashed
  // The format is: version:timestamp:request_body
  // CRITICAL: You must use the raw, unparsed event.body
  const basestring = `v0:${requestTimestamp}:${event.body}`;

  // Compute your own signature using the secret
  const hmac = crypto.createHmac('sha256', signingSecret);
  hmac.update(basestring);
  const mySignature = `v0=${hmac.digest('hex')}`;

  // Compare your signature with Slack's signature in a secure way
  // crypto.timingSafeEqual prevents "timing attacks"
  const isSignatureValid = crypto.timingSafeEqual(
    Buffer.from(mySignature, 'utf8'),
    Buffer.from(slackSignature, 'utf8')
  );

  if (!isSignatureValid) {
    throw new SlackVerificationError('Slack signature verification failed.');
  }
  logger.info('Verified that request is from Slack');
}

export default verifySlackRequest;
