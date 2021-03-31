import React, { SetStateAction } from "react";

// see https://github.com/Microsoft/TypeScript/issues/26223
export type TupleOf<T, N extends number> = N extends N
    ? number extends N
        ? T[]
        : _TupleOf<T, N, []>
    : never;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
    ? R
    : _TupleOf<T, N, [T, ...R]>;

export type DatePickerMode = "single" | "range";

export interface TablePageType {
    year: number;
    month: number;
}

export type DatePickerCtxType = {
    mode: DatePickerMode;
    date: Date | null;
    setDate: (newDate: SetStateAction<Date | null>, newPrevState?: React.SetStateAction<Date | null> | undefined) => void;
    minimumYear: number;
    maximumYear: number;
    prevDate: Date | null;
    maxDayRange: number;
};

export type TablePageReducerActionType =
    | {
          type: "set";
          payload: TablePageType;
      }
    | {
          type: "add";
          payload: {
              yearIncrement?: number;
              monthIncrement?: number;
          };
      };
