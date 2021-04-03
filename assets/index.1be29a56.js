var e,t,o=Object.defineProperty,r=Object.prototype.hasOwnProperty,n=Object.getOwnPropertySymbols,a=Object.prototype.propertyIsEnumerable,s=(e,t,r)=>t in e?o(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,i=(e,t)=>{for(var o in t||(t={}))r.call(t,o)&&s(e,o,t[o]);if(n)for(var o of n(t))a.call(t,o)&&s(e,o,t[o]);return e},l=(e,t,o)=>{if(!t.has(e))throw TypeError("Cannot "+o)},c=(e,t,o)=>(l(e,t,"read from private field"),o?o.call(e):t.get(e)),u=(e,t,o,r)=>(l(e,t,"write to private field"),r?r.call(e,o):t.set(e,o),o);import"./dynamic-import-polyfill.301f8c0f.js";import{D as d,b as m,a as f}from"./vendor.de0aed71.js";function h(e,t){return t-e>1e-9}function p(e,t){return e.x===t.x&&e.y===t.y}function C(e,t){const o=e=>e>=1&&e<=t;return o(e.x)&&o(e.y)}function b(e,t){return Array.from(Array(t[0]),(()=>Array(t[1]).fill(e)))}function y(e,t){const[o,r]=function(e){const t=d.useRef(e),o=d.useCallback((async(e,o)=>{t.current=e,o&&o()}),[]);return[t,o]}(t),n=d.useCallback((async t=>await r(await e(o.current,t))),[e,o.current]);return[o.current,n]}const g=Object.freeze({left:{x:-1,y:0},right:{x:1,y:0},up:{x:0,y:-1},down:{x:0,y:1}}),v={angles:Object.freeze({left:Math.PI,right:0,up:3*Math.PI/2,down:Math.PI/2}),getRotateAngle:function(e,t,o=!1){const r=this.angles[t]-this.angles[e],n=2*Math.PI;return(o?r-n:r+n)%n},getDirection:function(e,t){const o=2*Math.PI,r=((this.angles[e]+t)%o+o)%o;for(const n of Object.keys(this.angles))if(this.angles[n]===r)return n;throw new Error("Wrong rotation angle!")}};function w(e){const t=(new Option).style;return t.color=e,""!==t.color}function x(e,t,o){const r=e[o];e[o]=e[t],e[t]=r}class M{constructor(o){e.set(this,void 0),t.set(this,void 0),u(this,e,[void 0]),u(this,t,o)}empty(){return c(this,e).length<=1}push(o){const r=c(this,e);r.push(o);let n=r.length-1;for(;n>1&&c(this,t).call(this,r[n],r[n>>1]);)x(r,n,n>>1),n>>=1}pop(){const t=c(this,e);x(t,1,t.length-1);let o=1;for(;;){const e=t[2*o]?t[2*o+1]?t[2*o]<t[2*o+1]?2*o:2*o+1:2*o:-1;if(!(-1!==e&&t[o]>t[e]))break;x(t,o,e),o=e}return this.empty()?void 0:t.pop()}}e=new WeakMap,t=new WeakMap;const k=d.memo((function(e){const{gridCount:t=10,meshColor:o="#D8E8E8",perimeterColor:s="#3A3A3A",numberColor:l="#3A3A3A",chessProps:c,randomWallCounter:u,setRandomWallCounter:m}=e,f=((e,t)=>{var o={};for(var s in e)r.call(e,s)&&t.indexOf(s)<0&&(o[s]=e[s]);if(null!=e&&n)for(var s of n(e))t.indexOf(s)<0&&a.call(e,s)&&(o[s]=e[s]);return o})(e,["gridCount","meshColor","perimeterColor","numberColor","chessProps","randomWallCounter","setRandomWallCounter"]),x=d.useRef(null),k=d.useRef(),E=d.useRef(),R=d.useRef(0),T=d.useCallback((e=>{e?(x.current=e.getContext("2d"),k.current=e.width,E.current=e.height,R.current=Math.min(e.width,e.height)/(t+1)):x.current=null}),[t]),P=d.useCallback((()=>x.current),[]),B=d.useCallback((()=>R.current),[]),{drawWall:S,wall:A,dispatch:O,wallBuildColor:I}=function(e){const{gridCount:t,boardCtx:o,unitLength:r,wallBuildColor:n}=e,a=d.useMemo((()=>n&&w(n)?n:"#282C34"),[n]),s=d.useCallback(((e,t)=>{const{pos:{x:o,y:r},color:n}=t,a=[...e];return w(n)&&(a[o][r]=n),a}),[]),[i,l]=d.useReducer(s,b("",[t+1,t+1])),c=d.useCallback((()=>{const e=o(),n=r();e.save();for(let o=1;o<=t;o++)for(let r=1;r<=t;r++){const t=i[o][r];""!==t&&(e.save(),e.translate((o-1)*n,(r-1)*n),e.fillStyle=t,e.fillRect(0,0,n,n),e.restore())}e.restore()}),[o,t,r,i]);return{dispatch:l,wall:i,drawWall:c,wallBuildColor:a}}({gridCount:t,boardCtx:P,unitLength:B}),W=d.useCallback((()=>{const e=x.current,r=R.current,n=Math.min(k.current,E.current)/(t+1)*t;e.clearRect(-r,-r,k.current,E.current),e.save(),e.strokeStyle=s,e.strokeRect(0,0,n,n),e.restore();for(let a=1;a<=t;a++)e.save(),e.translate(a*r,0),e.save(),e.font=r/2+"px serif",e.fillStyle=l,e.textBaseline="middle",e.textAlign="center",e.fillText(a.toString(),-r/2,-r/2),e.restore(),a!==t&&(e.save(),e.strokeStyle=o,e.beginPath(),e.moveTo(0,0),e.lineTo(0,n),e.stroke(),e.restore()),e.restore();for(let a=1;a<=t;a++)e.save(),e.translate(0,a*r),e.save(),e.font=r/2+"px serif",e.fillStyle=l,e.textBaseline="middle",e.textAlign="center",e.fillText(a.toString(),-r/2,-r/2),e.restore(),a!==t&&(e.save(),e.strokeStyle=o,e.beginPath(),e.moveTo(0,0),e.lineTo(n,0),e.stroke(),e.restore()),e.restore();S()}),[S,t,o,l,s]);d.useEffect((()=>{const e=x.current,[t,o]=[k.current,E.current],r=t>o?[(t-o)/2,0]:[0,(o-t)/2],n=R.current;r[0]+=n,r[1]+=n,e.save(),e.translate(r[0],r[1])}),[]);const{animPromiseRef:F,state:D}=function(e){const{mainColor:t,frontColor:o,wallBuildColor:r,rotationSpeed:n=.004,moveSpeed:a=.004,wallBuildTime:s=200,wallBrushTime:l=200,cmdQueue:c,setCmdQueue:u,initialFrontDirection:m="up",initialCoordinate:f={x:6,y:6},boardCtx:x,unitLength:k,drawBoard:E,wall:R,wallDispatch:T,gridCount:P}=e,B=d.useMemo((()=>t&&w(t)?t:"#FE0000"),[t]),S=d.useMemo((()=>o&&w(o)?o:"#0001FE"),[o]),A=d.useMemo((()=>()=>.2*k()),[k]),O=d.useCallback(((e,t)=>{const o=x(),r=k(),n=A();E(),o.save(),o.translate((e.coordinate.x-1)*r,(e.coordinate.y-1)*r),o.save(),o.translate(.5*r,.5*r),o.rotate(t),o.translate(.5*-r,.5*-r),o.fillStyle=B,o.fillRect(0,0,r,r),o.fillStyle=S;const{x:a,y:s}=g[e.frontDirection];if(0===a){const e=1===s?r-n:0;o.fillRect(0,e,r,n)}else if(0===s){const e=1===a?r-n:0;o.fillRect(e,0,n,r)}o.restore(),o.restore()}),[E,x,k,B,S,A]),I=d.useCallback((async(e,t)=>{const o=e.coordinate,r=e=>Math.abs(e.x-t.x)+Math.abs(e.y-t.y),n=new M((function(e,t){return e.estimatedCost-t.estimatedCost}));n.push({pos:o,step:0,estimatedCost:r(o)});const a=b(1/0,[P+1,P+1]);a[o.x][o.y]=0;let s=await async function(){let e=n.pop();for(;void 0!==e&&!p(e.pos,t);){for(const t of Object.entries(g)){const o=t[0],s=t[1],i={x:e.pos.x+s.x,y:e.pos.y+s.y},l={pos:i,step:e.step+1,prev:e,action:{action:"move",direction:o},estimatedCost:e.step+1+r(i)};C(i,P)&&a[i.x][i.y]>l.step&&""===R[i.x][i.y]&&(a[i.x][i.y]=l.step,n.push(l))}e=n.pop()}return e}();const i=[];for(;void 0!==s;)p(s.pos,o)||i.unshift(s.action),s=s.prev;return i}),[P,R]),W=d.useCallback((async(e,t)=>{var o,c;const{coordinate:{x:u,y:d},frontDirection:m}=e,{x:f,y:p}=g[m],b=(e,t,o)=>{const r=0===t.x?"y":"x",n=t[r]>0,a=n?1:-1,s=n?P:1;for(let c=e[r];l=c,n?l<=s:l>=s;c+=a)if(""!==(i=c,"x"===r?R[i][e.y]:R[e.x][i]))return Math.min(Math.abs(e[r]-c)-1,o);var i,l;return Math.min(Math.abs(s-e[r]),o)};switch(t.action){case"go":{const r=null!=(o=t.step)?o:1,n=b(e.coordinate,g[e.frontDirection],r);let s=0;return await new Promise((t=>{const o=r=>{0===s&&(s=r);const l=r-s,c=Math.min(l*a,n);O(i(i({},e),{coordinate:{x:u+f*c,y:d+p*c}}),0),h(c,n)?requestAnimationFrame(o):t()};requestAnimationFrame(o)})),i(i({},e),{coordinate:{x:u+f*n,y:d+p*n}})}case"move":{const o=null!=(c=t.step)?c:1,r=b(e.coordinate,g[t.direction],o),{x:n,y:s}=g[t.direction];let l=0;return await new Promise((t=>{const o=c=>{0===l&&(l=c);const m=c-l,f=Math.min(m*a,r);O(i(i({},e),{coordinate:{x:u+n*f,y:d+s*f}}),0),h(f,r)?requestAnimationFrame(o):t()};requestAnimationFrame(o)})),i(i({},e),{coordinate:{x:u+n*r,y:d+s*r}})}case"moveTo":{const o=t.target,r=await I(e,o);let n=e;for(const e of r)n=await W(n,e);return n}case"rotateTo":{const o=Math.abs(v.getRotateAngle(m,t.direction,!!t.counterClockWise));let r=0;return await new Promise((a=>{const s=i=>{0===r&&(r=i);const l=i-r,c=Math.min(l*n,o);O(e,c*(t.counterClockWise?-1:1)),h(c,o)?requestAnimationFrame(s):a()};requestAnimationFrame(s)})),i(i({},e),{frontDirection:t.direction})}case"rotateBy":{const o=t.angle<0;let r=0;return await new Promise((a=>{const s=i=>{0===r&&(r=i);const l=i-r,c=Math.min(l*n,Math.abs(t.angle))*(o?-1:1);O(e,c),h(Math.abs(c),Math.abs(t.angle))?requestAnimationFrame(s):a()};requestAnimationFrame(s)})),i(i({},e),{frontDirection:v.getDirection(m,t.angle)})}case"build":{const[t,o]=[u+f,d+p],n={x:t,y:o};return C(n,P)&&""===R[t][o]?(await new Promise((e=>setTimeout(e,s))),T({pos:n,color:r})):console.log("Wall build failed"),i({},e)}case"brush":{const[o,r]=[u+f,d+p],n={x:o,y:r},a=t.color;return C(n,P)&&""!==R[o][r]&&w(a)?(await new Promise((e=>setTimeout(e,l))),T({pos:n,color:a})):console.log("Wall brush failed"),i({},e)}}}),[O,P,a,n,I,R,l,r,s,T]),F=d.useRef({coordinate:f,frontDirection:m}),[D,j]=y(W,F.current),L=d.useRef(Promise.resolve());return d.useEffect((()=>{L.current=L.current.then((async()=>{if(c.length>0){u((e=>e.slice(1)));const e=c[0];await j(e)}}))}),[u,c,j]),d.useEffect((()=>{O(F.current,0)}),[O]),{state:D,dispatch:j,drawChess:O,frontBorderLength:A,mainColor:B,frontColor:S,rotationSpeed:n,moveSpeed:a,cmdQueue:c,wallBuildTime:s,wallBrushTime:l,setCmdQueue:u,initialFrontDirection:m,initialCoordinate:f,initialState:F,animPromiseRef:L}}(i({boardCtx:P,unitLength:B,wallBuildColor:I,drawBoard:W,wallDispatch:O,wall:A,gridCount:t},c));return function(e){const{randomWallCounter:t,setRandomWallCounter:o,wall:r,wallDispatch:n,chessState:a,wallBuildColor:s,iterateCount:i=20,gridCount:l}=e,c=d.useCallback((()=>Math.ceil(Math.random()*l)),[l]),u=d.useCallback((()=>{const e=i*t;o(0);for(let t=0;t<e;++t){const[e,t]=[c(),c()],o={x:e,y:t};p(a.coordinate,o)||""!==r[e][t]||n({pos:o,color:s})}}),[a.coordinate,i,c,t,o,r,s,n]);d.useEffect((()=>{u()}),[u])}({randomWallCounter:u,setRandomWallCounter:m,animPromiseRef:F,wall:A,wallDispatch:O,chessState:D,wallBuildColor:I,gridCount:t}),d.createElement("canvas",i(i({},f),{ref:T}))}));function E(e){const{block:t,contentState:o}=e;return d.createElement("div",{className:"line"},d.createElement("div",{className:"line-number-wrapper",contentEditable:"false"},d.createElement("div",{className:"line-number"},o.getBlockMap().toList().findIndex((e=>(null==e?void 0:e.getKey())===t.getKey()))+1)),d.createElement(m.EditorBlock,i({},e)))}const R=d.memo((function(e){return d.createElement("div",{className:"editor-with-scroll"},d.createElement("div",{className:"line-number-column"}),d.createElement("div",{className:"inner-editor"},d.createElement(m.Editor,i({},e))))}));function T(){const e=d.useMemo((()=>({basicMove:/^\s*(?:(GO)|(TRA|MOV)\s*(LEF|TOP|RIG|BOT))\s*(\d*)$/,moveTo:/^\s*MOV\sTO\s*(\d+),\s?(\d+)\s*$/,turn:/^\s*TUN\s*(LEF|RIG|BAC)\s*$/,build:/^\s*BUILD\s*$/,brush:/^\s*BRU\s*\b(.+)$/})),[]),t=d.useMemo((()=>Object.freeze({LEF:"left",RIG:"right",TOP:"up",BOT:"down"})),[]),o=d.useMemo((()=>({basicMove:o=>{const r=e=>e?parseInt(e):void 0,n=o.match(e.basicMove);if(n)switch(n[1]){case"GO":return{action:"go",step:r(n[4])};case void 0:switch(n[2]){case"TRA":return{action:"move",direction:t[n[3]],step:r(n[4])};case"MOV":return[{action:"rotateTo",direction:t[n[3]]},{action:"go",step:r(n[4])}]}}},moveTo:t=>{const o=t.match(e.moveTo);if(o)return{action:"moveTo",target:{x:parseInt(o[1]),y:parseInt(o[2])}}},turn:t=>{const o=t.match(e.turn);if(o){const e=o[1];return{action:"rotateBy",angle:"LEF"===e?-Math.PI/2:"RIG"===e?Math.PI/2:"BAC"===e?Math.PI:0}}},build:t=>e.build.test(t)?{action:"build"}:void 0,brush:t=>{const o=t.match(e.brush);if(o){const e=o[1];if(w(e))return{action:"brush",color:e}}}})),[e.basicMove,e.brush,e.build,e.moveTo,e.turn,t]),r=d.useCallback((t=>{const{basicMove:o,moveTo:r,turn:n,build:a,brush:s}=e;for(const e of[o,r,n,a])if(e.test(t))return!0;const i=t.match(s);return!!i&&w(i[1].trim())}),[e]),n=d.useCallback((e=>{for(const t of[...Object.values(o)]){const o=t(e);if(o)return o}}),[o]),a=function(e){const{lineValidator:t}=e,[o,r]=d.useState(m.EditorState.createEmpty()),n=d.useCallback((()=>({component:E})),[]),a=d.useCallback((e=>{const o=e.getText();return t&&o.length&&!t(o)?"wrong-line":"default"}),[t]);return i(i({},e),{editorState:o,onChange:r,blockRendererFn:n,blockStyleFn:a})}({lineValidator:r}),{editorState:s}=a,[l,c]=d.useState([]),{pushCommands:u}=function(e){const{setCmdQueue:t,cmdConverter:o,editorState:r}=e;return{pushCommands:d.useCallback((()=>{const e=[];r.getCurrentContent().getBlockMap().toList().forEach((t=>{if(t){const r=o(t.getText());r&&(r instanceof Array?e.push(...r):e.push(r))}})),t((t=>t.concat(e)))}),[o,t,r])}}({setCmdQueue:c,cmdConverter:n,editorState:s});return{editorProps:a,cmdQueue:l,setCmdQueue:c,pushCommands:u}}function P(){const{editorProps:e,cmdQueue:t,setCmdQueue:o,pushCommands:r}=T(),[n,a]=d.useState(0),s=d.useCallback((()=>{a((e=>e+1))}),[]),l=d.useMemo((()=>({cmdQueue:t,setCmdQueue:o,initialCoordinate:{x:12,y:12}})),[t,o]),[c,u]=function(){const[e,t]=d.useState(0);return[e,d.useCallback((()=>{t((e=>e+1))}),[])]}();return d.createElement("div",{className:"app"},d.createElement(k,{width:700,height:700,gridCount:25,key:"Board"+c,randomWallCounter:n,setRandomWallCounter:a,chessProps:l}),d.createElement("div",{className:"editor-buttons-wrapper"},d.createElement(R,i({key:"CmdEditor"+c},e)),d.createElement("div",{className:"buttons"},d.createElement("button",{onClick:r},"执行"),d.createElement("button",{onClick:u},"Refresh"),d.createElement("button",{onClick:s},"随机墙"))))}f.render(d.createElement(P,null),document.getElementById("root"));