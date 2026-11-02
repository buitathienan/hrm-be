export function getMonthRange(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);

  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return { start, end };
}
