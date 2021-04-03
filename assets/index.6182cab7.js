import"./dynamic-import-polyfill.301f8c0f.js";import{D as t,a as e}from"./vendor.de0aed71.js";/* empty css                  */class n extends t.Component{constructor(){super(...arguments),this.state={name:"",hint:{type:"normal"}},this.hintsList={normal:"必填，长度为4~16个字符",error:{empty:"姓名不能为空",less:"长度至少为4个字符",more:"长度不能超过16个字符",disallowedChar:"包含非法字符，只能包含数字、英文字符、英文符号、汉字"},pass:"名称格式正确"},this.validationSteps=(()=>{function t(t){return t.length+(t.match(/\p{Unified_Ideograph}/gu)||[]).length}const e={empty:()=>t(this.state.name)>0,less:()=>t(this.state.name)>=4,more:()=>t(this.state.name)<=16,disallowedChar:()=>/^[\w\d\s!@#$%^&*)([\]+=.?/\\}{|<>:;"'_\p{Unified_Ideograph}]+$/u.test(this.state.name)};function n(t,e){return function(){const n=t();return n||this.setState({hint:{type:"error",errorType:e}}),n}}for(const r of Object.keys(e)){const t=r;e[t]=n(e[t],t).bind(this)}return e})(),this.handleValidation=()=>{let t=!0;for(const e of Object.values(this.validationSteps))if(!e()){t=!1;break}t&&this.setState({hint:{type:"pass"}})},this.retrieveHintText=()=>{const t=this.state.hint;if("error"===t.type){if(t.errorType)return this.hintsList[t.type][t.errorType];throw new Error("ErrorType not provided.")}return this.hintsList[t.type]}}render(){return t.createElement("div",{className:"name-form"},t.createElement("label",{htmlFor:"name"},"名称"),t.createElement("div",{className:`input-with-hint ${this.state.hint.type}`},t.createElement("input",{type:"text",name:"name",id:"name",onChange:t=>{this.setState({name:t.target.value})}}),t.createElement("div",{className:"hint"},this.retrieveHintText())),t.createElement("button",{className:"validation-button button",onClick:this.handleValidation},"验证"))}}e.render(t.createElement(n,null),document.getElementById("root"));