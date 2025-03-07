//2025-03-03T15:10:18.470Z -> 2025-03-03
export const keepOnlyDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

//2025-03-03T15:10:18.470Z -> 15:10
export const keepOnlyTime = (date: Date) => {
  return date.toISOString().split("T")[1].split(":").slice(0, 2).join(":");
};

export const getIntervalInWeeks = (oldDate: Date, recentDate: Date) => {
  const week = 7 * 24 * 60 * 60 * 1000;
  const day = 24 * 60 * 60 * 1000;

  function startOfWeek(dt: Date) {
    const weekday = dt.getDay();
    return new Date(dt.getTime() - Math.abs(0 - weekday) * day);
  }

  function weeksBetween(d1: Date, d2: Date) {
    return Math.ceil((startOfWeek(recentDate) - startOfWeek(oldDate)) / week);
  }

  return weeksBetween(oldDate, recentDate);
};
