import { TablePageType } from "./types";

export function normalizeTablePage(page: TablePageType): TablePageType {
    const sum = page.year * 12 + page.month;
    return sum <= 0
        ? {
              year: Math.floor(sum / 12),
              month: (sum % 12) + 12,
          }
        : {
              year: Math.floor(sum / 12),
              month: sum % 12,
          };
}

export function getDayCount(year: number, month: number): number {
    const dayCountForMonth = [
        31,
        28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];
    return (
        dayCountForMonth[month] +
        (month === 1 &&
        ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
            ? 1
            : 0)
    );
}
