import classnames from "classnames";
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
} from "react";
import { DatePickerCtx } from "./DatePicker";
import { TablePageType, TupleOf } from "./types";
import { getDayCount, normalizeTablePage } from "./utils";

export type DateTableData = TupleOf<TupleOf<Date, 7>, 6>;

function getTableData(year: number, month: number): DateTableData {
    const curDayCount = getDayCount(year, month);
    const lastPage = normalizeTablePage({ year, month: month - 1 });
    const nextPage = normalizeTablePage({ year, month: month + 1 });
    const lastDayCount = getDayCount(lastPage.year, lastPage.month);
    const firstDayOfMonthInWeek = (new Date(year, month).getDay() + 6) % 7;

    let curDate = 1;
    let nextPageDate = 1;
    type DateRow = TupleOf<Date, 7>;
    return Array.from(Array(6), (row: DateRow, rowIndex) => {
        row = Array(7) as DateRow;
        if (rowIndex === 0) {
            let curDayIndex = 0;
            for (; curDayIndex < firstDayOfMonthInWeek; ++curDayIndex) {
                row[curDayIndex] = new Date(
                    lastPage.year,
                    lastPage.month,
                    lastDayCount - firstDayOfMonthInWeek + curDayIndex + 1
                );
            }
            for (; curDayIndex < 7; ++curDayIndex, curDate++) {
                row[curDayIndex] = new Date(year, month, curDate);
            }
        } else {
            let curDayIndex = 0;
            for (
                ;
                curDayIndex < 7 && curDate <= curDayCount;
                ++curDayIndex, ++curDate
            ) {
                row[curDayIndex] = new Date(year, month, curDate);
            }
            for (; curDayIndex < 7; ++curDayIndex, ++nextPageDate) {
                row[curDayIndex] = new Date(
                    nextPage.year,
                    nextPage.month,
                    nextPageDate
                );
            }
        }
        return row;
    }) as DateTableData;
}

interface DateTableProps {
    tablePage: TablePageType;
}

export function DateTable(props: DateTableProps): React.ReactElement {
    const {
        tablePage: { year, month },
    } = props;
    const {
        mode,
        date,
        prevDate,
        setDate,
        minimumYear,
        maximumYear,
        maxDayRange,
    } = useContext(DatePickerCtx);
    const tableData = useMemo(() => getTableData(year, month), [month, year]);

    /* when the page alter after clicking on date not in current page, the focus
     will lose and widget disappear. Ref and effect below are used to re-focus the cell.
     */
    const focusedCellRef = useRef<HTMLTableCellElement>(null);
    useEffect(() => {
        if (focusedCellRef.current) {
            focusedCellRef.current.focus();
        }
    }, [year, month]);

    const handleCellClick = useCallback(
        (day: Date) => {
            switch (mode) {
                case "single": {
                    return () => {
                        setDate(day);
                    };
                }
                case "range": {
                    return () => {
                        if (
                            Math.floor(
                                Math.abs(
                                    (date?.getTime() ?? Infinity) -
                                        day.getTime()
                                )
                            ) /
                                86400000 >
                            maxDayRange
                        ) {
                            setDate(day, null);
                        } else {
                            setDate(day, date);
                        }
                    };
                }
            }
        },
        [date, maxDayRange, mode, setDate]
    );

    return (
        <table className="date-table">
            <thead>
                <tr>
                    <th>Mo</th>
                    <th>Tu</th>
                    <th>We</th>
                    <th>Th</th>
                    <th>Fr</th>
                    <th>Sa</th>
                    <th>Su</th>
                </tr>
            </thead>
            <tbody>
                {tableData.map((week, weekIndex) => (
                    <tr key={`${year}-${month}-${weekIndex}`}>
                        {week.map((day, dayIndex) => {
                            const cellYear = day.getFullYear();
                            const cellMonth = day.getMonth();
                            const cellTime = day.getTime();
                            if (
                                cellYear < minimumYear ||
                                cellYear > maximumYear
                            )
                                return <td className="empty-cell"></td>;
                            return (
                                <td
                                    tabIndex={0}
                                    key={`${year}-${month}-${weekIndex}-${dayIndex}`}
                                    onClick={handleCellClick(day)}
                                    className={classnames(
                                        {
                                            "selected-cell":
                                                date?.getTime() === cellTime ||
                                                (mode === "range" &&
                                                    prevDate?.getTime() ===
                                                        cellTime),
                                        },
                                        {
                                            "in-current-month":
                                                cellMonth === month,
                                        },
                                        {
                                            "in-range-cell":
                                                date &&
                                                prevDate &&
                                                (cellTime - date.getTime()) *
                                                    (cellTime -
                                                        prevDate.getTime()) <
                                                    0,
                                        }
                                    )}
                                    ref={
                                        date?.getTime() == cellTime
                                            ? focusedCellRef
                                            : undefined
                                    }
                                >
                                    {day.getDate()}
                                </td>
                            );
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
