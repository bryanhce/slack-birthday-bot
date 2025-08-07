import { repository } from './repository/dynamodb';
import { Birthday } from './types';
import dateToday from './helpers/dateToday';
import { formatBirthtdaysByMonth } from './helpers/formatBirthdayMessage';
import { logger } from './logger/logger';
import sendSlackMessage from './slackInterface/sendMessage';
import aggregateByUser from './helpers/aggregateByUser';

// TODO abstract into a parent reminder function
async function monthlyReminder() {
  const queryDate = dateToday();

  try {
    // TODO get birthdayByMonth
    const birthdays = await repository.getBirthdaysByDate(queryDate);
    if (birthdays.length === 0) {
      logger.info(`No birthday reminders to send out for month ${queryDate}`);
      return;
    }

    const groupByUser: Record<string, Birthday[]> = aggregateByUser(birthdays)

    const reminderPromises = Object.entries(groupByUser).map(
      async ([userId, bdayArray]) => {
        const text = formatBirthtdaysByMonth(bdayArray);
        await sendSlackMessage(text, userId);
        logger.info(`Sent monthly birthday reminder for ${userId}`);
      }
    );
    await Promise.all(reminderPromises);

    // TODO change to month
    logger.info(`Completed sending monthly birthday reminders for ${queryDate}`);
  } catch (error) {
    logger.error('Error in monthlyReminder', error);
  }
}

export default monthlyReminder;
