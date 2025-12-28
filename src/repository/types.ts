import { z } from 'zod';

export interface BirthdayQueryOptionsByDate {
  month: string;
  day?: string;
}

export const BirthdaySchema = z.object({
  userId: z.string(),
  name: z.string(),
  month: z.string(),
  day: z.string(),
  channelId: z.string(),
  // keeping userName for slack bot so that there is notification by default
  userName: z.string(),
});
export const BirthdayArraySchema = z.array(BirthdaySchema);

export type Birthday = z.infer<typeof BirthdaySchema>;
