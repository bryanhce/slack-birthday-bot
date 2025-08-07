import { repository } from './repository/dynamodb';
import dateToday from './helpers/dateToday';
import {
  formatBirthdayByDay,
  prependUserName,
} from './helpers/formatBirthdayMessage';
import { logger } from './logger/logger';
import sendSlackMessage from './slackInterface/sendMessage';
import aggregateByChannel from './helpers/aggregateByUser';

async function dailyReminder() {
  const [month, day] = dateToday();

  try {
    const birthdays = await repository.getBirthdaysByDate(month, day);
    if (birthdays.length === 0) {
      logger.info(`No birthday reminders to send out for ${month}-${day}`);
      return;
    }

    const groupByChannel = aggregateByChannel(birthdays);

    const reminderPromises = Object.entries(groupByChannel).map(
      async ([channelId, bdayArray]) => {
        const { userName } = bdayArray[0];
        const text = prependUserName(formatBirthdayByDay(bdayArray), userName);
        await sendSlackMessage(text, channelId);
        logger.info(`Sent birthday reminder for user ${userName}`);
      }
    );
    await Promise.all(reminderPromises);

    logger.info(`Completed sending birthday reminders for ${month}-${day}`);
  } catch (error) {
    logger.error('Error in dailyReminder', error);
  }
}

export default dailyReminder;
