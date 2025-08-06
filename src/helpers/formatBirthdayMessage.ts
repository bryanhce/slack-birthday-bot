import { Birthday } from '../types';

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Assume birthdays are all for 1 user
 * @param birthdays 
 * @returns formatted birthday string
 * Looks like
 * January
    - test : Jan 1
    December
    - another test: Dec 9
 */
export function formatBirthtdaysByMonth(birthdays: Birthday[]): string {
  const grouped: Record<
    string,
    Array<Omit<Birthday, 'user_id'>>
  > = birthdays.reduce(
    (acc, bday) => {
      const monthStr = bday.date.split('-')[0];
      if (!acc[monthStr]) {
        acc[monthStr] = [];
      }
      acc[monthStr].push(bday);
      return acc;
    },
    {} as Record<string, Array<Omit<Birthday, 'user_id'>>>
  );

  const formatted = Object.entries(grouped)
    .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10)) // sort by month
    .map(([monthStr, entries]) => {
      const monthIndex = parseInt(monthStr, 10) - 1;
      const fullMonthName = monthNames[monthIndex];

      const lines = entries
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(({ name, date }) => {
          const [mm, dd] = date.split('-');
          const shortMonth = shortMonthNames[parseInt(mm, 10) - 1];
          return `- ${name}: ${shortMonth} ${parseInt(dd, 10)}`;
        });

      return `*${fullMonthName}*\n${lines.join('\n')}`;
    });

  return formatted.join('\n\n');
}

/**
 * Assume all birthdays are same here
 * @param birthdays
 */
export function formatBirthdayByDay(birthdays: Birthday[]): string {
  return birthdays
    .map((bday) => `🥳 It's ${bday.name}'s birthday today!`)
    .join('\n');
}
