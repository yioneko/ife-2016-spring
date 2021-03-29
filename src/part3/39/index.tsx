import React from "react";
import ReactDOM from "react-dom";
import { Table } from "./Table";
import "./index.scss";

function compareNumber(a: number, b: number, ascending = false): number {
    if (ascending) return a - b;
    else return b - a;
}

ReactDOM.render(
    <div className="wrapper">
        <Table
            headings={["姓名", "语文", "数学", "英语", "总分"]}
            data={[
                {
                    姓名: "小明",
                    语文: 80,
                    数学: 90,
                    英语: 70,
                    总分: 240,
                    key: "xiaoming",
                },
                {
                    姓名: "小红",
                    语文: 90,
                    数学: 60,
                    英语: 90,
                    总分: 240,
                    key: "xiaohong",
                },
                {
                    姓名: "小亮",
                    语文: 60,
                    数学: 100,
                    英语: 70,
                    总分: 230,
                    key: "xiaoliang",
                },{
                    姓名: "e",
                    语文: 94,
                    数学: 84,
                    英语: 74,
                    总分: 252,
                    key: "e",
                },
                {
                    姓名: "d",
                    语文: 65,
                    数学: 100,
                    英语: 77,
                    总分: 242,
                    key: "d",
                },
                {
                    姓名: "c",
                    语文: 85,
                    数学: 88,
                    英语: 70,
                    总分: 243,
                    key: "c",
                },
                {
                    姓名: "b",
                    语文: 80,
                    数学: 95,
                    英语: 63,
                    总分: 238,
                    key: "b",
                },
                {
                    姓名: "a",
                    语文: 63,
                    数学: 60,
                    英语: 90,
                    总分: 213,
                    key: "a",
                }
            ]}
            comparators={{
                语文: compareNumber,
                数学: compareNumber,
                英语: compareNumber,
                总分: compareNumber,
            }}
        />
        <div className="fill"></div>
    </div>,
    document.getElementById("root")
);
