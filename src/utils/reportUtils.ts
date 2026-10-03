export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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
