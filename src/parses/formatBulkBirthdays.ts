import { Birthday } from "../types";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const shortMonthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// assume birthdays are all for 1 user
export function formatBirthtdays(birthdays: Birthday[]): string {
  const grouped: Record<string, Array<Omit<Birthday, "user_id">>> = {};

  for (const bday of birthdays) {
    const monthStr = bday.date.split("-")[0];
    if (!grouped[monthStr]) {
      grouped[monthStr] = [];
    }
    grouped[monthStr].push(bday);
  }

  const formatted = Object.entries(grouped)
    .sort(([a], [b]) => parseInt(a) - parseInt(b)) // sort by month
    .map(([monthStr, entries]) => {
      const monthIndex = parseInt(monthStr, 10) - 1;
      const fullMonthName = monthNames[monthIndex];

      const lines = entries
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(({ name, date }) => {
          const [mm, dd] = date.split("-");
          const shortMonth = shortMonthNames[parseInt(mm, 10) - 1];
          return `- ${name}: ${shortMonth} ${parseInt(dd, 10)}`;
        });

      return `*${fullMonthName}*\n${lines.join("\n")}`;
    });

  return formatted.join("\n\n");
}
