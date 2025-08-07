import { ReminderConfig } from './types';
import dateToday from './helpers/dateToday';
import { formatBirthtdaysByMonth } from './helpers/formatBirthdayMessage';
import sendBirthdayReminders from './baseReminder';

const monthlyReminderConfig: ReminderConfig = {
  reminderType: 'monthly',
  getDateArgs: () => ({ month: dateToday()[0] }),
  formatMessage: formatBirthtdaysByMonth,
  getDateLogString: (args) => `${args.month}`,
};

async function monthlyReminder() {
  return sendBirthdayReminders(monthlyReminderConfig);
}

export default monthlyReminder;
