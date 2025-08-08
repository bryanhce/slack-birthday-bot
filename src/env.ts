import { z } from 'zod';

const envSchema = z.object({
  DYNAMODB_TABLE: z.string().min(1), // Ensures it's a non-empty string
  SLACK_BOT_TOKEN: z.string().min(1),
  SLACK_SIGNING_SECRET: z.string().min(1),
});

// This will throw a detailed error if validation fails,
// causing your app to fail fast on a cold start if misconfigured.
const ENV = envSchema.parse(process.env); // in aws lambda, it will take from secrets
export default ENV;
