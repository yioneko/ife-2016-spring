import"./dynamic-import-polyfill.301f8c0f.js";document.querySelector("#add-btn").addEventListener("click",function(){let t=!0;const e=document.createElement("tr");e.innerHTML="<td>城市</td><td>空气质量</td><td>操作</td>";const n=document.querySelector("#aqi-table"),l=document.createElement("template");l.innerHTML="<tr><td></td><td></td><td><button>删除</button></td></tr>";return function(){let d=function(){let t=document.querySelector("#aqi-city-input").value,e=document.querySelector("#aqi-value-input").value,n=t.match(/^\s*([\p{Unified_Ideograph}\w\s]+)\s*$/u);if(null===n)return;t=n[1];let l=e.match(/^\s*(\d+)\s*$/);return null!==l?(e=l[1],[t,e]):void 0}();if(d){t&&(t=!1,n.appendChild(e));let o=l.content.firstElementChild.cloneNode(!0);const r=o.querySelectorAll("td");r[0].textContent=d[0],r[1].textContent=d[1],r[2].querySelector("button").addEventListener("click",(()=>{n.removeChild(o),1==n.childElementCount&&(n.removeChild(e),t=!0)})),n.appendChild(o)}else alert("Invalid input!")}}());
