import { repository } from './repository/dynamodb';
import { Birthday } from './types';
import dateToday from './helpers/dateToday';
import {
  formatBirthtdaysByMonth,
  prependUserName,
} from './helpers/formatBirthdayMessage';
import { logger } from './logger/logger';
import sendSlackMessage from './slackInterface/sendMessage';
import aggregateByChannel from './helpers/aggregateByUser';

// TODO abstract into a parent reminder function
async function monthlyReminder() {
  const [month] = dateToday();

  try {
    const birthdays = await repository.getBirthdaysByDate(month);
    if (birthdays.length === 0) {
      logger.info(`No birthday reminders to send out for ${month}`);
      return;
    }

    const groupByChannel: Record<string, Birthday[]> =
      aggregateByChannel(birthdays);

    const reminderPromises = Object.entries(groupByChannel).map(
      async ([channelId, bdayArray]) => {
        const { userName } = bdayArray[0];
        const text = prependUserName(
          formatBirthtdaysByMonth(bdayArray),
          userName
        );
        await sendSlackMessage(text, channelId);
        logger.info(`Sent monthly birthday reminder for user ${userName}`);
      }
    );
    await Promise.all(reminderPromises);

    logger.info(`Completed sending monthly birthday reminders for ${month}`);
  } catch (error) {
    logger.error('Error in monthlyReminder', error);
  }
}

export default monthlyReminder;
