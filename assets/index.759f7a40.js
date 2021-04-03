import"./dynamic-import-polyfill.301f8c0f.js";const e=document.querySelector("canvas");e.width=1e3,e.height=800;const t=e.getContext("2d"),i=document.querySelector(".msg .try-info"),s=document.querySelector(".msg .command"),a=document.querySelector(".control-console"),n=document.querySelector(".create-console"),r=document.querySelector(".create-button"),o=n.dynamic,l=n.energy;var d,h;(h=d||(d={}))[h.create=0]="create",h[h.start=1]="start",h[h.stop=2]="stop",h[h.destroy=3]="destroy";class c{constructor(e,t,i,s,a){this.id=e,this.fuel=100,this.totalDistance=0,this.speed=i,this.radius=t,this.flying=!1,this.fuelConsumptionSpeed=s,this.fuelChargeSpeed=a,this.width=65,this.height=30}receiveCommand(e){const t=this.commandDecoder(e);if(this.id===t.id)if("start"===t.operation)this.flying=!0;else if("stop"===t.operation)this.flying=!1;else if("destroy"===t.operation)return u[this.id-1]=null,!0;return!1}updateState(e){e/=1e3;const t=this.fuel-(this.fuelConsumptionSpeed-this.fuelChargeSpeed)*e;if(this.flying)if(t<=0){this.flying=!1;const t=this.fuel/(this.fuelConsumptionSpeed-this.fuelChargeSpeed);this.totalDistance+=t*this.speed,this.fuel=(e-t)*this.fuelChargeSpeed}else this.fuel=t,this.totalDistance+=e*this.speed;else this.fuel+=this.fuelChargeSpeed*e;this.fuel=Math.min(this.fuel,100),this.draw()}draw(){t.save(),t.translate(e.width/2,e.height/2),t.rotate(this.totalDistance/this.radius),t.translate(0,-this.radius),t.fillStyle="#7d8597",t.beginPath(),t.rect(-this.width/2,-this.height/2,this.width,this.height),t.arc(this.width/2,0,this.height/2,-Math.PI/2,Math.PI/2),t.arc(-this.width/2,0,this.height/2,-Math.PI/2,Math.PI/2,!0),t.fill(),t.beginPath(),t.fillStyle="#0353a4",t.arc(-this.width/2+this.height/2,0,this.height/2*Math.sqrt(2),Math.PI/4*3,Math.PI/4*5),t.arc(-this.width/2,0,this.height/2,-Math.PI/2,Math.PI/2,!0),t.fill(),t.beginPath(),t.fillStyle="#caf0f8",t.font="15px sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText(`${this.id}号-${this.fuel.toFixed(0)}%`,0,0),t.restore()}commandDecoder(e){return{id:1+(e>>2),operation:d[3&e]}}}const u=[null,null,null,null],m=class{static simulateTry(e){let t=1;!function s(){Math.random()<m.failureRate?(++t,setTimeout(s,m.retryInterval)):(i.innerHTML=`Tried ${t} times:`,e())}()}static spreadCommand(e){m.simulateTry((()=>{for(const t of u)t&&setTimeout((()=>{t.receiveCommand(this.commandEncoder(e))&&m.updateDom(e)}),m.spreadTime);s.innerHTML=JSON.stringify(e)}))}static updateDom(e){const t=a.querySelector(`.spaceship${e.id}-commands`);if(t)switch(e.operation){case"create":t.classList.remove("destroyed");break;case"destroy":t.classList.add("destroyed")}}static commandEncoder(e){return e.id-1<<2|d[e.operation]}};let p=m;p.failureRate=.1,p.spreadTime=300,p.retryInterval=500;for(let y=1;y<=4;++y){const e=document.createElement("div");e.className=`spaceship${y}-commands destroyed`;const t=document.createElement("label");t.innerHTML=`对${y}号飞船下达指令：`,e.appendChild(t);const i=document.createElement("button");i.innerHTML="开始飞行",i.className="start-button",i.addEventListener("click",(()=>{p.spreadCommand({id:y,operation:"start"})})),e.appendChild(i);const s=document.createElement("button");s.innerHTML="停止飞行",s.className="stop-button",s.addEventListener("click",(()=>{p.spreadCommand({id:y,operation:"stop"})})),e.appendChild(s);const n=document.createElement("button");n.innerHTML="销毁",n.className="destroy-button",n.addEventListener("click",(()=>{p.spreadCommand({id:y,operation:"destroy"})})),e.appendChild(n),a.appendChild(e)}r.addEventListener("click",(()=>{let e,t,a;for(let i=0;i<4;++i)if(null===u[i]){switch(o.value){case"1":e=30,t=5;break;case"2":e=50,t=7;break;case"3":e=80,t=9;break;default:throw new Error("Unknown radio value")}switch(l.value){case"1":a=2;break;case"2":a=3;break;case"3":a=4;break;default:throw new Error("Unknown radio value")}return void p.simulateTry((()=>{u[i]=new c(i+1,90*(i+1),e,t,a),s.innerHTML=`Create spaceship: ${i+1}`,p.updateDom({id:i+1,operation:"create"})}))}i.innerHTML="",s.innerHTML="No spaceship to create"}));let f=0;requestAnimationFrame((function i(s){t.clearRect(0,0,e.width,e.height),t.save(),t.beginPath(),t.fillStyle="#0353a4",t.translate(e.width/2,e.height/2),t.arc(0,0,50,0,2*Math.PI),t.fill(),t.restore();for(const e of u)null==e||e.updateState(f?s-f:0);f=s,requestAnimationFrame(i)}));