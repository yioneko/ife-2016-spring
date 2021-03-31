import React, {
    createContext,
    SetStateAction,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { DatePickerWidget } from "./DatePickerWidget";
import { DatePickerCtxType, DatePickerMode } from "./types";

interface DatePickerProps<M extends DatePickerMode>
    extends React.ComponentPropsWithRef<"input"> {
    dateText: string;
    setDateText: React.Dispatch<React.SetStateAction<string>>;
    minimumYear?: number;
    maximumYear?: number;
    mode?: M;
    maxDayRange?: M extends "single" ? never : number;
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const DatePickerCtx = createContext<DatePickerCtxType>(undefined!);

export function DatePicker<M extends DatePickerMode>(
    props: DatePickerProps<M>
): React.ReactElement {
    const {
        mode = "single",
        maxDayRange = 300,
        dateText,
        setDateText,
        minimumYear = 1900,
        maximumYear = 2200,
        ...inputProps
    } = props;

    const [date, setDate] = useState(
        !isNaN(Date.parse(dateText)) ? new Date(dateText) : null
    );

    const [prevDate, setPrevDate] = useState<Date | null>(null);

    const modeSpecificSetDate = useMemo(() => {
        switch (mode) {
            case "single": {
                return setDate;
            }
            case "range": {
                return (
                    newDate: SetStateAction<Date | null>,
                    newPrevDate?: SetStateAction<Date | null>
                ) => {
                    if (newPrevDate !== undefined) setPrevDate(newPrevDate);
                    setDate(newDate);
                };
            }
        }
        throw new Error("Mode unspecified.");
    }, [mode]);

    const validateDateText = useCallback(
        (text: string): void => {
            switch (mode) {
                case "single": {
                    if (!isNaN(Date.parse(text))) {
                        const newDate = new Date(text);
                        const year = newDate.getFullYear();
                        if (year >= minimumYear && year <= maximumYear) {
                            newDate.setHours(0, 0, 0, 0);
                            setDate(newDate);
                        }
                    } else {
                        setDate(null);
                    }
                    break;
                }
                case "range": {
                    const dates = text.split(/\s*,\s*/);
                    if (dates.length === 2) {
                        if (dates.every((v) => !isNaN(Date.parse(v)))) {
                            const [newPrevDate, newDate] = dates.map(
                                (v) => new Date(v)
                            );
                            if (
                                Math.floor(
                                    Math.abs(
                                        newPrevDate.getTime() -
                                            newDate.getTime()
                                    ) / 86400000
                                ) <= maxDayRange
                            ) {
                                setPrevDate(newPrevDate);
                                setDate(newDate);
                                break;
                            }
                        }
                    }
                    setPrevDate(null);
                    setDate(null);
                    break;
                }
            }
        },
        [maxDayRange, maximumYear, minimumYear, mode]
    );

    useEffect(() => {
        if (date) {
            if (prevDate) {
                const [prevTime, time] = [prevDate.getTime(), date.getTime()];
                const [minDate, maxDate] = [
                    prevTime < time ? prevDate : date,
                    prevTime < time ? date : prevDate,
                ];
                setDateText(
                    `${minDate.toLocaleDateString()}, ${maxDate.toLocaleDateString()}`
                );
            } else {
                setDateText(date.toLocaleDateString());
            }
        } else {
            setDateText("");
        }
    }, [date, prevDate, setDateText]);

    return (
        <DatePickerCtx.Provider
            value={{
                mode,
                date,
                setDate: modeSpecificSetDate,
                minimumYear,
                maximumYear,
                prevDate,
                maxDayRange,
            }}
        >
            <div className="date-picker">
                <input
                    {...inputProps}
                    className="date-picker-text-input"
                    type="text"
                    value={dateText}
                    onChange={(e) => setDateText(e.target.value)}
                    onBlur={(e) => validateDateText(e.target.value)}
                />
                <DatePickerWidget />
            </div>
        </DatePickerCtx.Provider>
    );
}
