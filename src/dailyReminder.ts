import dateToday from './helpers/dateToday';
import { formatBirthdayByDay } from './helpers/formatBirthdayMessage';
import sendBirthdayReminders, { ReminderConfig } from './baseReminder';

const dailyReminderConfig: ReminderConfig = {
  reminderType: 'daily',
  getDateArgs: dateToday,
  formatMessage: formatBirthdayByDay,
  getDateLogString: (args) => `${args.month}-${args.day}`,
};

async function dailyReminder() {
  return sendBirthdayReminders(dailyReminderConfig);
}

export default dailyReminder;
