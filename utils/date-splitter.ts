//2025-03-03T15:10:18.470Z -> 2025-03-03
export const keepOnlyDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

//2025-03-03T15:10:18.470Z -> 15:10
export const keepOnlyTime = (date: Date) => {
  return date.toISOString().split("T")[1].split(":").slice(0, 2).join(":");
};

export const getIntervalInWeeks = (startDate: Date, endDate: Date) => {
  const timeDiff = endDate.getTime() - startDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return Math.ceil(daysDiff / 7);
};
