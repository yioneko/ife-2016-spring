import React, { useContext, useMemo } from "react";
import { DatePickerCtx } from "./DatePicker";
import { TablePageReducerActionType, TablePageType } from "./types";

interface DatePickerNavigatorProps {
    tablePage: TablePageType;
    tablePageDispatch: React.Dispatch<TablePageReducerActionType>;
}

export function DatePickerNavigator(
    props: DatePickerNavigatorProps
): React.ReactElement {
    const { tablePage, tablePageDispatch } = props;
    const { minimumYear, maximumYear } = useContext(DatePickerCtx);

    const yearOptions = useMemo(() => {
        const options: JSX.Element[] = [];
        for (let year = minimumYear; year <= maximumYear; ++year) {
            options.push(
                <option value={year} key={`option-${year}`}>
                    {year}
                </option>
            );
        }
        return options;
    }, [maximumYear, minimumYear]);

    const monthOptions = useMemo(() => {
        const options: JSX.Element[] = [];
        for (let month = 1; month <= 12; ++month) {
            options.push(
                <option value={month - 1} key={`option-${month}`}>
                    {month}
                </option>
            );
        }
        return options;
    }, []);

    return (
        <div className="date-navigator">
            <button
                className="last-year-button"
                onClick={() =>
                    tablePageDispatch({
                        type: "add",
                        payload: { yearIncrement: -1 },
                    })
                }
                disabled={tablePage.year <= minimumYear}
            ></button>
            <button
                className="last-month-button"
                onClick={() =>
                    tablePageDispatch({
                        type: "add",
                        payload: { monthIncrement: -1 },
                    })
                }
                disabled={
                    tablePage.year <= minimumYear && tablePage.month === 0
                }
            ></button>
            <select
                className="year-select"
                name="year"
                id="year"
                value={tablePage.year}
                onChange={(e) =>
                    tablePageDispatch({
                        type: "set",
                        payload: {
                            year: parseInt(e.target.value),
                            month: tablePage.month,
                        },
                    })
                }
            >
                {yearOptions}
            </select>
            <select
                className="month-select"
                name="month"
                id="month"
                value={tablePage.month}
                onChange={(e) =>
                    tablePageDispatch({
                        type: "set",
                        payload: {
                            year: tablePage.year,
                            month: parseInt(e.target.value),
                        },
                    })
                }
            >
                {monthOptions}
            </select>
            <button
                className="next-month-button"
                onClick={() =>
                    tablePageDispatch({
                        type: "add",
                        payload: { monthIncrement: 1 },
                    })
                }
                disabled={
                    tablePage.year >= maximumYear && tablePage.month === 11
                }
            ></button>
            <button
                className="next-year-button"
                onClick={() =>
                    tablePageDispatch({
                        type: "add",
                        payload: { yearIncrement: 1 },
                    })
                }
                disabled={tablePage.year >= maximumYear}
            ></button>
        </div>
    );
}
