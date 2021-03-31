import React, { useState } from "react";
import "./App.scss";
import { DatePicker } from "./DatePicker";

export function App(): React.ReactElement {
    const [dateText, setDateText] = useState("");
    const [dateTextRange, setDateTextRange] = useState("");
    return (
        <div>
            <label htmlFor="date">单日期选择</label>
            <DatePicker
                id="single-picker"
                name="date"
                mode="single"
                dateText={dateText}
                setDateText={setDateText}
                minimumYear={1900}
                maximumYear={2100}
            />
            <label htmlFor="range-picker">日期范围选择</label>
            <DatePicker
                id="range-picker"
                name="date-range"
                mode="range"
                dateText={dateTextRange}
                setDateText={setDateTextRange}
            />
        </div>
    );
}
