export {};
/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = dat.getDate();
    d = d < 10 ? "0" + d : d;
    return y + "-" + m + "-" + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = "";
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    北京: randomBuildData(500),
    上海: randomBuildData(300),
    广州: randomBuildData(200),
    深圳: randomBuildData(100),
    成都: randomBuildData(300),
    西安: randomBuildData(500),
    福州: randomBuildData(100),
    厦门: randomBuildData(100),
    沈阳: randomBuildData(500),
};

function getRenderData() {
    const source =
        aqiSourceData[
            document.querySelector("#city-select").selectedOptions[0]
                .textContent
        ];
    const view = document.querySelector("#form-gra-time input:checked").value;
    const renderData = {
        view: view,
        data: {},
    };
    switch (view) {
        case "day": {
            renderData.data = JSON.parse(JSON.stringify(source));
            break;
        }
        case "month": {
            let curVal = 0,
                lstMonth,
                curMonth,
                curCount = 0;
            let first = true;
            for (const date in source) {
                curMonth = date.match(/(\d+-\d+)-\d+/)[1];
                let val = source[date];
                if (first || lstMonth === curMonth) {
                    first = false;
                    curVal += val;
                    curCount++;
                } else {
                    renderData.data[lstMonth] = curVal / curCount;
                    (curVal = val), (curCount = 1);
                }
                lstMonth = curMonth;
            }
            renderData.data[lstMonth] = curVal / curCount; // the last month
            break;
        }
        case "week": {
            let curVal = 0,
                curWeek = 1,
                curCount = 0;
            for (const date in source) {
                curVal += source[date];
                curCount++;
                if (curCount == 7) {
                    curCount = 0;
                    renderData.data[`Week-${curWeek}`] = curVal / 7;
                    curWeek++;
                    curVal = 0;
                }
            }
            if (curCount > 0)
                renderData.data[`Week-${curWeek}`] = curVal / curCount;
            break;
        }
    }
    return renderData;
}

function generateDiv(date, width, value, maxHeight) {
    const wrapper = document.createElement("div");
    const div = document.createElement("div");
    const span = document.createElement("span");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (width < ctx.measureText(date).width)
        span.style.writingMode = "vertical-lr";
    span.style.fontSize = "12px"; // can't be less?
    span.textContent = date;
    div.style.width = width + "px";
    div.style.height = (value / 500) * maxHeight + "px";
    div.style.backgroundColor = `rgb(${Math.floor(
        Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
    )})`;
    div.title = `${date}: ${value}`;
    wrapper.appendChild(div);
    wrapper.appendChild(span);
    return wrapper;
}

const chart = document.querySelector(".aqi-chart-wrap");

function render(data) {
    let width;
    switch (data.view) {
        case "day":
            width = 10;
            break;
        case "week":
            width = 70;
            break;
        case "month":
            width = 300;
            break;
    }
    for (const date in data.data)
        chart.appendChild(generateDiv(date, width, data.data[date], 200));
}

let pageState = {
    nowSelectCity: -1,
    nowGraTime: "day",
};

function inputHandler() {
    if (
        document.querySelector("#city-select").selectedIndex ===
            pageState.nowSelectCity &&
        document.querySelector("#form-gra-time input:checked").value ===
            pageState.nowGraTime
    )
        return;
    pageState.nowSelectCity = document.querySelector(
        "#city-select"
    ).selectedIndex;
    pageState.nowGraTime = document.querySelector(
        "#form-gra-time input:checked"
    ).value;
    while (chart.firstChild) chart.removeChild(chart.firstChild);
    render(getRenderData());
}

document.querySelectorAll("input").forEach((value) =>
    value.addEventListener("change", function () {
        this.checked = true;
        inputHandler();
    })
);
document.querySelector("select").oninput = inputHandler;

render(getRenderData());
