import { repository } from './repository/dynamodb';
import { Birthday } from './types';
import dateToday from './helpers/dateToday';
import { formatBirthdayByDay } from './helpers/formatBirthdayMessage';
import { logger } from './logger/logger';
import sendSlackMessage from './slackInterface/sendMessage';
import aggregateByUser from './helpers/aggregateByUser';

async function sameDayReminder() {
  const queryDate = dateToday();

  try {
    const birthdays = await repository.getBirthdaysByDate(queryDate);
    if (birthdays.length === 0) {
      logger.info(`No birthday reminders to send out for ${queryDate}`);
      return;
    }

    const groupByUser: Record<string, Birthday[]> = aggregateByUser(birthdays)

    // enhancement: do multi threading if have sufficient traffic
    const reminderPromises = Object.entries(groupByUser).map(
      async ([userId, bdayArray]) => {
        const text = formatBirthdayByDay(bdayArray);
        await sendSlackMessage(text, userId);
        logger.info(`Sent birthday reminder for ${userId}`);
      }
    );
    await Promise.all(reminderPromises);

    logger.info(`Completed sending birthday reminders for ${queryDate}`);
  } catch (error) {
    logger.error('Error in sameDayReminder', error);
  }
}

export default sameDayReminder;
