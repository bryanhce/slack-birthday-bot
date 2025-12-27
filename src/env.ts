import { z } from 'zod';

const envSchema = z
  .object({
    DYNAMODB_TABLE: z.string().min(1), // Ensures it's a non-empty string
    SLACK_BOT_TOKEN: z.string().min(1).optional(),
    SLACK_SIGNING_SECRET: z.string().min(1).optional(),
    TELEGRAM_BOT_TOKEN: z.string().min(1).optional(),
    TELEGRAM_SECRET_TOKEN: z.string().min(1).optional(),
    BOT_PLATFORM: z.enum(['slack', 'telegram']),
  })
  .refine(
    (data) => {
      // Validate platform-specific required fields
      if (data.BOT_PLATFORM === 'slack') {
        return data.SLACK_BOT_TOKEN && data.SLACK_SIGNING_SECRET;
      }
      if (data.BOT_PLATFORM === 'telegram') {
        return data.TELEGRAM_BOT_TOKEN && data.TELEGRAM_SECRET_TOKEN;
      }
      return true;
    },
    {
      message:
        'Platform-specific environment variables are required based on BOT_PLATFORM',
    }
  );

// This will throw a detailed error if validation fails,
// causing your app to fail fast on a cold start if misconfigured.
const ENV = envSchema.parse(process.env); // in aws lambda, it will take from secrets
export default ENV;
