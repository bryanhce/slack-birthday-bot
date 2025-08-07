import { z } from 'zod';
import logger from '../logger/logger';

/**
 * Safely parses data with a Zod schema and logs a detailed error on failure.
 *
 * @param data The unknown data to parse (e.g., from a DB or API).
 * @param schema The Zod schema to use for validation.
 * @returns The parsed data if successful, otherwise `undefined`.
 */
function safeParse<T extends z.ZodTypeAny>(
  data: unknown,
  schema: T
): z.infer<T> | undefined {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  logger.error('Zod validation failed.', {
    error: result.error,
  });
  return undefined;
}

export default safeParse;
