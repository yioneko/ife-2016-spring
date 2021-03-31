import React, { useCallback, useContext, useEffect, useReducer } from "react";
import { DatePickerCtx } from "./DatePicker";
import { DatePickerNavigator } from "./DatePickerNavigator";
import { DateTable } from "./DateTable";
import { TablePageReducerActionType, TablePageType } from "./types";
import { normalizeTablePage } from "./utils";

function getYearAndMonthOfDate(date: Date): TablePageType {
    return {
        year: date.getFullYear(),
        month: date.getMonth(),
    };
}

export function DatePickerWidget(): React.ReactElement {
    const tablePageReducer = useCallback(
        (prevState: TablePageType, action: TablePageReducerActionType) => {
            switch (action.type) {
                case "set": {
                    return normalizeTablePage(action.payload);
                }
                case "add": {
                    const {
                        yearIncrement = 0,
                        monthIncrement = 0,
                    } = action.payload;
                    return normalizeTablePage({
                        year: prevState.year + yearIncrement,
                        month: prevState.month + monthIncrement,
                    });
                }
            }
        },
        []
    );

    const { date } = useContext(DatePickerCtx);

    const [tablePage, tablePageDispatch] = useReducer(
        tablePageReducer,
        getYearAndMonthOfDate(date ?? new Date())
    );

    useEffect(() => {
        if (date) {
            tablePageDispatch({
                type: "set",
                payload: getYearAndMonthOfDate(date),
            });
        }
    }, [date]);

    return (
        <div className="date-picker-widget">
            <DatePickerNavigator
                tablePage={tablePage}
                tablePageDispatch={tablePageDispatch}
            />
            <DateTable tablePage={tablePage} />
        </div>
    );
}
