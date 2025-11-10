export const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const getDateRange = (
  period: "today" | "week" | "month" | "year",
): { start: string; end: string } => {
  const now = new Date();
  const end = formatDate(now);
  let start: string;

  switch (period) {
    case "today":
      start = end;
      break;
    case "week":
      start = formatDate(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000));
      break;
    case "month":
      start = formatDate(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000));
      break;
    case "year":
      start = formatDate(new Date(Date.now() - 364 * 24 * 60 * 60 * 1000));
      break;
  }

  return { start, end };
};
