//2025-03-03T15:10:18.470Z -> 2025-03-03
export const keepOnlyDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

//2025-03-03T15:10:18.470Z -> 15:10
export const keepOnlyTime = (date: Date) => {
  return date.toISOString().split("T")[1].split(":").slice(0, 2).join(":");
};

// export const getIntervalInWeeks = (oldDate: Date, recentDate: Date) => {
//   const week = 7 * 24 * 60 * 60 * 1000;
//   const day = 24 * 60 * 60 * 1000;

//   function startOfWeek(dt: Date) {
//     const weekday = dt.getDay();
//     return new Date(dt.getTime() - Math.abs(0 - weekday) * day);
//   }

//   function weeksBetween(d1: Date, d2: Date) {
//     return Math.ceil((startOfWeek(recentDate) - startOfWeek(oldDate)) / week);
//   }

//   return weeksBetween(oldDate, recentDate);
// };

// Returns the ISO week of the date.
export const getWeek = (date: Date) => {
  var date = new Date(date.getTime());
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1.
  var week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
};

// Returns the four-digit year corresponding to the ISO week of the date.
export const getWeekYear = (date: Date) => {
  var date = new Date(date.getTime());
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  return date.getFullYear();
};
