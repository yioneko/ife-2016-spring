var e=Object.defineProperty,r=Object.prototype.hasOwnProperty,a=Object.getOwnPropertySymbols,t=Object.prototype.propertyIsEnumerable,n=(r,a,t)=>a in r?e(r,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):r[a]=t,o=(e,o)=>{for(var c in o||(o={}))r.call(o,c)&&n(e,c,o[c]);if(a)for(var c of a(o))t.call(o,c)&&n(e,c,o[c]);return e};import"./dynamic-import-polyfill.301f8c0f.js";import{D as c,a as l}from"./vendor.de0aed71.js";function d(e){const{headings:n,data:l,comparators:d}=e,i=((e,n)=>{var o={};for(var c in e)r.call(e,c)&&n.indexOf(c)<0&&(o[c]=e[c]);if(null!=e&&a)for(var c of a(e))n.indexOf(c)<0&&t.call(e,c)&&(o[c]=e[c]);return o})(e,["headings","data","comparators"]),[s,m]=c.useState({orderBy:void 0,ascending:!1}),y=c.useMemo((()=>c.createElement("thead",null,c.createElement("tr",null,n.map((e=>c.createElement("th",{className:e===s.orderBy?"sorted sorted-"+(s.ascending?"ascending":"descending"):void 0,onClick:()=>{d&&d[e]&&m((r=>r.orderBy===e?o(o({},r),{ascending:!r.ascending}):{orderBy:e,ascending:!1}))},key:e},e)))))),[d,n,s.ascending,s.orderBy]),p=c.useMemo((()=>{const{orderBy:e,ascending:r}=s,a=[...l];if(d&&e){const t=d[e];t&&a.sort(((a,n)=>t(a[e],n[e],r)))}return c.createElement("tbody",null,a.map((e=>c.createElement("tr",{key:e.key},n.map((r=>c.createElement("td",{key:r},e[r])))))))}),[d,l,n,s]);return c.createElement("table",o({},i),y,p)}function i(e,r,a=!1){return a?e-r:r-e}l.render(c.createElement("div",{className:"wrapper"},c.createElement(d,{headings:["姓名","语文","数学","英语","总分"],data:[{"姓名":"小明","语文":80,"数学":90,"英语":70,"总分":240,key:"xiaoming"},{"姓名":"小红","语文":90,"数学":60,"英语":90,"总分":240,key:"xiaohong"},{"姓名":"小亮","语文":60,"数学":100,"英语":70,"总分":230,key:"xiaoliang"},{"姓名":"e","语文":94,"数学":84,"英语":74,"总分":252,key:"e"},{"姓名":"d","语文":65,"数学":100,"英语":77,"总分":242,key:"d"},{"姓名":"c","语文":85,"数学":88,"英语":70,"总分":243,key:"c"},{"姓名":"b","语文":80,"数学":95,"英语":63,"总分":238,key:"b"},{"姓名":"a","语文":63,"数学":60,"英语":90,"总分":213,key:"a"}],comparators:{"语文":i,"数学":i,"英语":i,"总分":i}}),c.createElement("div",{className:"fill"})),document.getElementById("root"));