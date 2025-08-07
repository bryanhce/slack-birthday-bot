import dateToday from './helpers/dateToday';
import { formatBirthdayByDay } from './helpers/formatBirthdayMessage';
import { ReminderConfig } from './types';
import sendBirthdayReminders from './baseReminder';

const dailyReminderConfig: ReminderConfig = {
  reminderType: 'daily',
  getDateArgs: () => {
    const [month, day] = dateToday();
    return {
      month,
      day,
    };
  },
  formatMessage: formatBirthdayByDay,
  getDateLogString: (args) => `${args.month}-${args.day}`,
};

async function dailyReminder() {
  return sendBirthdayReminders(dailyReminderConfig);
}

export default dailyReminder;
