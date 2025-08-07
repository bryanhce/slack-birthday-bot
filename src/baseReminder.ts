import birthdayRepository from './repository/dynamodb';
import aggregateByChannel from './helpers/aggregateByChannel';
import { prependUserName } from './helpers/formatBirthdayMessage';
import logger from './logger/logger';
import sendSlackMessage from './slackInterface/sendMessage';
import { ReminderConfig } from './types';

async function sendBirthdayReminders(config: ReminderConfig) {
  const dateArgs = config.getDateArgs();
  const dateLogString = config.getDateLogString(dateArgs);

  try {
    const birthdays = await birthdayRepository.findByMonthDay(dateArgs);

    if (birthdays.length === 0) {
      logger.info(
        `No ${config.reminderType} birthday reminders to send out for ${dateLogString}`
      );
      return;
    }

    const groupByChannel = aggregateByChannel(birthdays);

    const reminderPromises = Object.entries(groupByChannel).map(
      async ([channelId, bdayArray]) => {
        const { userName } = bdayArray[0];
        const formattedBirthdays = config.formatMessage(bdayArray);
        const text = prependUserName(userName, formattedBirthdays);

        await sendSlackMessage(text, channelId);
        logger.info(
          `Sent ${config.reminderType} birthday reminder for user ${userName}`
        );
      }
    );
    await Promise.all(reminderPromises);

    logger.info(
      `Completed sending ${config.reminderType} birthday reminders for ${dateLogString}`
    );
  } catch (error) {
    logger.error(`Error in ${config.reminderType}Reminder`, error);
  }
}

export default sendBirthdayReminders;
