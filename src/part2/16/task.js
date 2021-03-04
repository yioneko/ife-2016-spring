function validateData() {
    let city = document.querySelector("#aqi-city-input").value;
    let quality = document.querySelector("#aqi-value-input").value;

    let cityMatch = city.match(/^\s*([\p{Unified_Ideograph}\w\s]+)\s*$/u);
    if (cityMatch === null) return;
    else city = cityMatch[1];

    let qualityMatch = quality.match(/^\s*(\d+)\s*$/);
    if (qualityMatch === null) return;
    else quality = qualityMatch[1];
    return [city, quality];
}

document.querySelector("#add-btn").addEventListener(
    "click",
    (function () {
        let first = true;
        const header = document.createElement("tr");
        header.innerHTML = "<td>城市</td><td>空气质量</td><td>操作</td>";
        const table = document.querySelector("#aqi-table");
        const rowTemplate = document.createElement("template");
        rowTemplate.innerHTML =
            "<tr><td></td><td></td><td><button>删除</button></td></tr>";
        let inner = function () {
            let data = validateData();
            if (!data) {
                alert("Invalid input!");
                return;
            } else {
                if (first) {
                    first = false;
                    table.appendChild(header);
                }
                let newRow = rowTemplate.content.firstElementChild.cloneNode(
                    true
                );
                /* the HTMLTemplateElement has a content property, which is a read-only DocumentFragment 
             containing the DOM subtree which the template represents. Note that directly using the 
             value of the content could lead to unexpected behavior. A DocumentFragment is not a valid 
             target for various event. （没仔细看文档被搞了...用content返回的是一个不完全的DocumentFragment对象）
            */
                const td = newRow.querySelectorAll("td");
                td[0].textContent = data[0];
                td[1].textContent = data[1];
                td[2].querySelector("button").addEventListener("click", () => {
                    table.removeChild(newRow);
                    if (table.childElementCount == 1) {
                        table.removeChild(header);
                        first = true;
                    }
                });
                table.appendChild(newRow);
            }
        };
        return inner; // closure
    })()
);
