// this script is used for the telegram bot only
// only needs to be run once to set up the wehbook

import axios, { AxiosError } from 'axios';
import 'dotenv/config';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBHOOK_URL = process.env.API_GATEWAY_URL;
const SECRET_TOKEN = process.env.TELEGRAM_SECRET_TOKEN;

/* eslint-disable no-console */
if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN environment variable is required');
  process.exit(1);
}

if (!WEBHOOK_URL) {
  console.error('❌ API_GATEWAY_URL environment variable is required');
  process.exit(1);
}

if (!SECRET_TOKEN) {
  console.error('❌ TELEGRAM_SECRET_TOKEN environment variable is required');
  process.exit(1);
}

const botToken: string = BOT_TOKEN;
const webhookUrl: string = WEBHOOK_URL;
const secretToken: string = SECRET_TOKEN;

interface SetWebhookRequest {
  url: string;
  secret_token?: string;
}

async function setWebhook(): Promise<void> {
  try {
    const url = `https://api.telegram.org/bot${botToken}/setWebhook`;

    const payload: SetWebhookRequest = {
      url: webhookUrl,
      secret_token: secretToken,
    };

    await axios.post(url, payload);

    console.log(`✅ Webhook successfully set to: ${webhookUrl}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ description?: string }>;
      console.error(
        '❌ Failed to set webhook:',
        axiosError.response?.data?.description || axiosError.message
      );
    } else {
      console.error(
        '❌ Failed to set webhook:',
        error instanceof Error ? error.message : String(error)
      );
    }
    process.exit(1);
  }
}
/* eslint-disable no-console */

setWebhook();
