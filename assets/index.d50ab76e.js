import"./dynamic-import-polyfill.301f8c0f.js";const e=document.querySelector(".tree-component"),t=document.querySelector(".query input"),n=document.querySelector(".query button"),o=document.querySelector(".operations input"),l=document.querySelector(".add-button"),r=document.querySelector(".remove-button");let a=null;function c(){let e="";const t=Math.ceil(5*Math.random());for(let n=0;n<t;n++)e+=[String.fromCharCode(Math.floor(26*Math.random())+"a".charCodeAt(0)),String.fromCharCode(Math.floor(26*Math.random())+"A".charCodeAt(0))][Math.floor(Math.random()+.5)];return e}function d(e,t){const n=document.createElement("div");return n.className="name",n.innerHTML=t,e.appendChild(n),e.addEventListener("click",(function(e){e.stopPropagation(),null!==a&&a.classList.remove("selected"),this.classList.add("selected"),a=this})),e.addEventListener("click",(function(e){e.stopPropagation(),this.classList.contains("collapsed")?this.classList.remove("collapsed"):this.classList.add("collapsed")})),e}e.appendChild(function e(t,n){const o=Math.ceil(5*Math.random());for(let l=0;l<o;l++){const o=document.createElement("li");d(o,c()),t>1&&Math.random()>.2?(o.classList.add("directory"),o.appendChild(e(t-1,document.createElement("ol")))):o.classList.add("item"),n.appendChild(o)}return n}(3,document.createElement("ol"))),n.addEventListener("click",(()=>{const n=t.value,o=document.createNodeIterator(e,NodeFilter.SHOW_ELEMENT,{acceptNode:e=>e.classList.contains("name")?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});let l=o.nextNode();for(;null!==l;){const t=l.classList;if(l.innerHTML===n){t.add("queried");let n=l.parentElement;for(;null!==n&&n!==e;)n.classList.contains("collapsed")&&n.classList.remove("collapsed"),n=n.parentElement,null===n?console.error("Tree component: exception of structure. Source: ",l):n=n.parentElement}else t.contains("queried")&&t.remove("queried");l=o.nextNode()}})),l.addEventListener("click",(()=>{var e;null!==a&&(null==(e=a.parentElement)||e.insertBefore(d(document.createElement("li"),o.value),a.nextElementSibling).classList.add("item"))})),r.addEventListener("click",(()=>{var e;null!==a&&(null==(e=a.parentElement)||e.removeChild(a),a=null)}));