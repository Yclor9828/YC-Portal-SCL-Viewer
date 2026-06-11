"use strict";(()=>{var Ne=acquireVsCodeApi(),q=[{key:"name",label:"Name",width:"40%"},{key:"typeRef",label:"Data Type",width:"20%"},{key:"logicalAddress",label:"Address",width:"18%"},{key:"comment",label:"Comment",width:"22%"}],ft="",se="",u=[],Le="",we="",V="",ze=[],Me=new Map,ce={errors:0,warnings:0},Fe=new Set,C=null,P=null,ge=null,O=new Map,Ie=[],re=null,ae=!1,Q=[],X=0,Z=null,Se=null,he="",Je=null,U=[],G=-1,Ue=1,ot=16,h=null,g=null,y="cell",H=!1,x=null,Xe=null,Y;function pt(){let n=document.createElement("style");n.textContent=`
		:root {
			color-scheme: light dark;
			--grid-line: var(--vscode-editorWidget-border, rgba(127, 127, 127, 0.2));
			--grid-header-bg: var(--vscode-editorWidget-background, rgba(127, 127, 127, 0.06));
			--focus: var(--vscode-focusBorder, #007acc);
			--dup-bg: color-mix(in srgb, var(--vscode-inputValidation-warningBackground, rgba(255, 165, 0, 0.16)) 70%, transparent);
			--dup-border: var(--vscode-inputValidation-warningBorder, rgba(255, 165, 0, 0.55));
			--err-bg: color-mix(in srgb, var(--vscode-inputValidation-errorBackground, rgba(255, 0, 0, 0.16)) 70%, transparent);
			--err-border: var(--vscode-inputValidation-errorBorder, rgba(255, 0, 0, 0.55));
		}
		body {
			padding: 0;
			margin: 0;
			font-family: var(--vscode-font-family);
			font-size: var(--vscode-font-size);
			color: var(--vscode-editor-foreground);
			background: var(--vscode-editor-background);
		}
		#app {
			padding: 10px 12px 64px;
			box-sizing: border-box;
		}
		.toolbar {
			display: flex;
			gap: 10px;
			align-items: center;
			position: sticky;
			top: 0;
			z-index: 20;
			padding: 8px 10px;
			margin: 0 0 10px;
			border: 1px solid var(--grid-line);
			border-radius: 8px;
			background: color-mix(in srgb, var(--vscode-editor-background) 92%, var(--vscode-editor-foreground) 8%);
			backdrop-filter: blur(6px);
		}
		.toolbar .title {
			font-weight: 600;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			max-width: 600px;
		}
		.toolbar .spacer { flex: 1; }
		.toolbar button {
			font: inherit;
			padding: 4px 10px;
			border-radius: 6px;
			border: 1px solid var(--grid-line);
			background: var(--vscode-button-secondaryBackground, rgba(127, 127, 127, 0.12));
			color: var(--vscode-button-secondaryForeground, inherit);
			cursor: pointer;
		}
		.toolbar button:hover {
			background: color-mix(in srgb, var(--vscode-button-secondaryBackground, rgba(127, 127, 127, 0.12)) 80%, var(--vscode-editor-foreground) 20%);
		}
		.toolbar button.primary {
			background: var(--vscode-button-background);
			color: var(--vscode-button-foreground);
			border-color: color-mix(in srgb, var(--vscode-button-background) 70%, var(--grid-line));
		}
		.toolbar button.primary:hover {
			background: var(--vscode-button-hoverBackground);
		}
		.toolbar input.filter {
			font: inherit;
			padding: 4px 10px;
			border-radius: 6px;
			border: 1px solid var(--grid-line);
			background: var(--vscode-input-background);
			color: var(--vscode-input-foreground);
			min-width: 260px;
		}
		.toolbar input.filter:focus {
			outline: 1px solid var(--focus);
			outline-offset: 1px;
		}
		td.find-hit {
			box-shadow: inset 0 0 0 1px var(--vscode-editor-findMatchHighlightBorder, rgba(90, 120, 200, 0.55));
			background: color-mix(in srgb, var(--vscode-editor-findMatchHighlightBackground, rgba(90, 120, 200, 0.18)) 70%, transparent);
		}
		td.find-current {
			box-shadow: inset 0 0 0 2px var(--vscode-editor-findMatchBorder, var(--vscode-focusBorder, #007acc));
			background: color-mix(in srgb, var(--vscode-editor-findMatchBackground, rgba(255, 200, 0, 0.22)) 70%, transparent);
		}
		.badge {
			font-family: var(--vscode-editor-font-family);
			font-size: 11px;
			opacity: 0.9;
			padding: 1px 8px;
			border-radius: 999px;
			border: 1px solid var(--grid-line);
		}
		.badge.warn {
			border-color: var(--dup-border);
			background: var(--dup-bg);
		}
		.badge.error {
			border-color: var(--err-border);
			background: var(--err-bg);
			color: var(--vscode-errorForeground, inherit);
		}
		td.cell-error {
			background: var(--err-bg);
			box-shadow: inset 3px 0 0 0 var(--err-border);
		}
		td.cell-warn {
			background: var(--dup-bg);
			box-shadow: inset 3px 0 0 0 var(--dup-border);
		}
		.notice {
			margin: 0 0 10px;
			padding: 8px 10px;
			border: 1px solid var(--grid-line);
			border-radius: 8px;
			background: var(--grid-header-bg);
		}
		.table-wrap {
			border: 1px solid var(--grid-line);
			border-radius: 8px;
			overflow: auto;
		}
		table {
			width: 100%;
			border-collapse: collapse;
			table-layout: fixed;
		}
		th, td {
			border-bottom: 1px solid var(--grid-line);
			border-right: 1px solid var(--grid-line);
			padding: 2px 6px;
			height: 18px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			vertical-align: middle;
		}
		th:last-child, td:last-child { border-right: none; }
		th {
			position: sticky;
			top: 0;
			z-index: 10;
			background: var(--grid-header-bg);
			font-weight: 600;
		}
		th.col-gutter, td.col-gutter {
			width: 44px;
			text-align: right;
			padding-right: 6px;
			font-family: var(--vscode-editor-font-family);
			font-size: 11px;
			opacity: 0.8;
		}
		td.col-gutter {
			cursor: pointer;
			user-select: none;
		}
		td.col-gutter:hover {
			background: color-mix(in srgb, var(--vscode-list-hoverBackground, rgba(127, 127, 127, 0.08)) 70%, transparent);
		}
		tr.row-selected td.col-gutter {
			background: color-mix(in srgb, var(--vscode-list-inactiveSelectionBackground, rgba(127, 127, 127, 0.14)) 70%, transparent);
		}
		td[data-col] {
			outline: none;
		}
		td[data-col] {
			font-family: var(--vscode-editor-font-family);
			font-size: var(--vscode-editor-font-size);
		}
		td.cell-selected {
			outline: 2px solid var(--focus);
			outline-offset: -2px;
		}
		td.cell-in-range {
			background: color-mix(in srgb, var(--vscode-list-inactiveSelectionBackground, rgba(127, 127, 127, 0.14)) 65%, transparent);
		}
		tr.dup td[data-col="name"] {
			background: var(--dup-bg);
			box-shadow: inset 0 0 0 1px var(--dup-border);
		}
		tr.has-error td.col-gutter {
			box-shadow: inset 3px 0 0 0 var(--err-border);
		}
		tr.has-warn td.col-gutter {
			box-shadow: inset 3px 0 0 0 var(--dup-border);
		}
		.autocomplete {
			position: fixed;
			z-index: 1000;
			background: var(--vscode-editorWidget-background);
			border: 1px solid var(--vscode-editorWidget-border);
			box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
			border-radius: 6px;
			max-height: 220px;
			overflow: auto;
			min-width: 180px;
			font-family: var(--vscode-editor-font-family);
			font-size: var(--vscode-editor-font-size);
		}
		.autocomplete .item {
			padding: 3px 8px;
			cursor: pointer;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.autocomplete .item:hover {
			background: var(--vscode-list-hoverBackground);
		}
		.autocomplete .item.selected {
			background: var(--vscode-list-activeSelectionBackground);
			color: var(--vscode-list-activeSelectionForeground);
		}
		.ctxmenu {
			position: fixed;
			z-index: 1001;
			background: var(--vscode-editorWidget-background);
			border: 1px solid var(--vscode-editorWidget-border);
			box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
			border-radius: 6px;
			padding: 4px;
			min-width: 180px;
			font-family: var(--vscode-font-family);
			font-size: var(--vscode-font-size);
		}
		.ctxmenu .item {
			padding: 5px 8px;
			border-radius: 4px;
			cursor: pointer;
			user-select: none;
			white-space: nowrap;
		}
		.ctxmenu .item:hover {
			background: var(--vscode-list-hoverBackground);
		}
		.empty {
			padding: 12px;
			opacity: 0.9;
		}
	`,document.head.appendChild(n)}function Ze(n){switch(n){case"error":return 4;case"warning":return 3;case"info":return 2;case"hint":default:return 1}}function et(n,e){return Ze(n)>=Ze(e)?n:e}function bt(n){let e=String(n??"");return e.includes("<DataTypeName>")?"typeRef":e.includes("<LogicalAddress>")?"logicalAddress":(e.includes("<Name>"),"name")}function yt(n){let e=String(n??"").split(`
`),t=[],r=0;for(let i=0;i<e.length;i++){let a=(e[i]??"").trim();if(!a.includes("<SW.Tags.PlcTag")||a.includes("<SW.Tags.PlcTagTable"))continue;let l=/\bID\s*=\s*"([^"]+)"/i.exec(a),c=String(l?.[1]??"").trim();if(c||(c=u[r]?.rowKey??""),r++,!c)continue;let m=i;for(let f=i;f<e.length;f++)if((e[f]??"").includes("</SW.Tags.PlcTag>")){m=f;break}t.push({rowKey:c,startLine:i,endLine:m}),i=m}return t}function ht(n,e){if(n.length===0)return"";(!Number.isFinite(e)||e<0)&&(e=0);for(let t of n)if(t.startLine<=e&&e<=t.endLine)return t.rowKey;return""}function it(){if(Me=new Map,ce={errors:0,warnings:0},!se||u.length===0||ze.length===0)return;let n=se.split(`
`).map(t=>t.replace(/\r$/,"")),e=yt(se);for(let t of ze){if(!t||typeof t!="object")continue;let r=t.severity;if(r==="error"?ce.errors++:r==="warning"&&ce.warnings++,r!=="error"&&r!=="warning")continue;let i=Number.isFinite(t.startLine)?t.startLine:0,a=ht(e,i);if(!a)continue;let l=bt(n[i]??""),c=String(t.message??"").trim();if(!c)continue;let m=Me.get(a)??{maxSeverity:r,byCol:{}};m.maxSeverity=et(m.maxSeverity,r);let f=m.byCol[l]??{severity:r,messages:[]};f.severity=et(f.severity,r),f.messages.includes(c)||f.messages.push(c),m.byCol[l]=f,l!=="name"&&!m.byCol.name&&(m.byCol.name={severity:r,messages:[c]}),Me.set(a,m)}}function vt(){if(we||!document.getElementById("app"))return;let e=document.getElementById("diag-count");if(e){let r=ce.errors,i=ce.warnings;e.className=r>0?"badge error":"badge warn",e.textContent=r>0?`${r} error(s), ${i} warning(s)`:`${i} warning(s)`,e.style.display=r>0||i>0?"":"none"}let t=document.getElementById("tag-body");if(t)for(let r of Array.from(t.querySelectorAll("tr[data-row-key]"))){let i=String(r.getAttribute("data-row-key")??""),a=i?Me.get(i):void 0;r.classList.toggle("has-error",a?.maxSeverity==="error"),r.classList.toggle("has-warn",a?.maxSeverity==="warning");for(let l of Array.from(r.querySelectorAll("td[data-col]"))){let c=String(l.getAttribute("data-col")??""),m=a?.byCol[c];m&&(m.severity==="error"||m.severity==="warning")?(l.classList.toggle("cell-error",m.severity==="error"),l.classList.toggle("cell-warn",m.severity==="warning"),l.title=m.messages.join(`
`)):(l.classList.remove("cell-error"),l.classList.remove("cell-warn"),l.title="")}}}function at(n){let e=document.getElementById("app");if(!e)return;e.replaceChildren();let t=document.createElement("div");t.className="notice",t.textContent=n,e.appendChild(t)}function De(n){let e=String(n??"").trim();return e.startsWith("#")&&(e=e.slice(1)),e=e.trim(),e.length>=2&&e[0]==='"'&&e[e.length-1]==='"'&&(e=e.slice(1,-1).replace(/""/g,'"')),e=e.trim(),e?e.toUpperCase():""}function xt(n){let e=/^\s*(<\?xml[^?]*\?>)(\s*)/i.exec(n);if(!e)return{prolog:"",rest:n};let t=e[1]??"",r=n.slice((e[0]??"").length);return{prolog:t,rest:r}}function We(n){return String(n??"").trim().replace(/_/g,"-").toLowerCase()}function lt(n){let e=Array.from(n.getElementsByTagName("MultilingualTextItem"));if(e.length===0)return null;if(e.length===1)return e[0]??null;let t=We(navigator.language??"");if(t){let i=e.find(a=>{let l=a.getElementsByTagName("Culture")[0]?.textContent??"";return We(l)===t});if(i)return i}return e.find(i=>{let a=i.getElementsByTagName("Culture")[0]?.textContent??"";return We(a)==="en-us"})??e[0]??null}function wt(n){let{prolog:e,rest:t}=xt(n);try{let i=new DOMParser().parseFromString(t,"application/xml"),a=i.getElementsByTagName("parsererror");if(a&&a.length>0)return{rows:[],prolog:e,error:"XML parser error. Use \u201CReopen With\u2026\u201D \u2192 \u201CText Editor\u201D to fix.",doc:null};let l=i.getElementsByTagName("SW.Tags.PlcTagTable")[0]??null,c=null;l&&(c=Array.from(l.getElementsByTagName("ObjectList")).find(k=>k.parentNode===l)??null);let m=c?Array.from(c.children).filter(T=>T?.tagName==="SW.Tags.PlcTag"):Array.from(i.getElementsByTagName("SW.Tags.PlcTag"));if(m.length===0)return l?{rows:[],prolog:e,error:"",doc:i}:{rows:[],prolog:e,error:"No <SW.Tags.PlcTag> entries found (not a PLC tag table XML?)",doc:null};let f=[],v=0;for(let T of m){let k=T.getAttribute("ID")??String(v);v++;let M=ve(T,"AttributeList");if(!M)continue;let B=M.getElementsByTagName("Name")[0],W=M.getElementsByTagName("DataTypeName")[0],R=M.getElementsByTagName("LogicalAddress")[0],ee=String(B?.textContent??"").trim(),me=String(W?.textContent??"").trim(),Ce=String(R?.textContent??"").trim(),fe="",pe=Array.from(T.getElementsByTagName("MultilingualText")).find(d=>(d.getAttribute("CompositionName")??"")==="Comment"),o=pe?lt(pe):null;if(o){let d=o.getElementsByTagName("Text")[0];fe=String(d?.textContent??"").trim()}f.push({rowKey:k,name:ee,typeRef:me,logicalAddress:Ce,comment:fe})}return{rows:f,prolog:e,error:"",doc:i}}catch{return{rows:[],prolog:e,error:"Failed to parse XML.",doc:null}}}function ve(n,e){for(let t of Array.from(n.childNodes))if(t.nodeType===Node.ELEMENT_NODE){let r=t;if(r.tagName===e)return r}return null}function _e(n){let e=new Map;for(let t of n){let r=De(t.name);r&&e.set(r,(e.get(r)??0)+1)}for(let[t,r]of[...e.entries()])r<=1&&e.delete(t);return e}function le(){let n=document.getElementById("tag-body");if(!n)return;let e=_e(u),t=document.getElementById("dup-count");t&&(t.textContent=`${e.size} duplicate name(s)`,t.style.display=e.size>0?"":"none");let r=document.getElementById("tag-count");r&&(r.textContent=`${u.length} tag(s)`);for(let i of Array.from(n.querySelectorAll("tr[data-row]"))){let a=Number(i.getAttribute("data-row")??-1),l=u[a]?.name??"",c=De(l);c&&e.has(c)?i.classList.add("dup"):i.classList.remove("dup")}}function Et(n){let e=0,t=!1;for(let r of Array.from(n.getElementsByTagName("*"))){let i=r.getAttribute("ID");if(!i)continue;let a=String(i).trim();if(a){if(/^[0-9a-fA-F]+$/.test(a)){let l=Number.parseInt(a,16);Number.isFinite(l)&&l>e&&(e=l);continue}if(t=!0,/^\d+$/.test(a)){let l=Number.parseInt(a,10);Number.isFinite(l)&&l>e&&(e=l)}}}ot=t?10:16,Ue=Math.max(1,e+1)}function ne(){let n=Ue;return Ue++,n.toString(ot).toUpperCase()}function j(){if(!h||!g)return null;let n=Math.min(h.r,g.r),e=Math.max(h.r,g.r);if(y==="row")return{r0:n,r1:e,c0:0,c1:Math.max(0,q.length-1)};let t=Math.min(h.c,g.c),r=Math.max(h.c,g.c);return{r0:n,r1:e,c0:t,c1:r}}function Ct(n){for(let e of Array.from(n.querySelectorAll("td.cell-selected, td.cell-in-range")))e.classList.remove("cell-selected","cell-in-range");for(let e of Array.from(n.querySelectorAll("tr.row-selected")))e.classList.remove("row-selected")}function A(n){Ct(n);let e=j(),t=g;if(!e||!t)return;for(let i=e.r0;i<=e.r1;i++)for(let a=e.c0;a<=e.c1;a++){let l=n.querySelector(`td[data-r="${i}"][data-c="${a}"]`);l&&l.classList.add("cell-in-range")}if(n.querySelector(`td[data-r="${t.r}"][data-c="${t.c}"]`)?.classList.add("cell-selected"),y==="row")for(let i=e.r0;i<=e.r1;i++)n.querySelector(`tr[data-row="${i}"]`)?.classList.add("row-selected")}function I(n,e){let t=document.querySelector(`td[data-r="${n}"][data-c="${e}"]`);t?.focus(),t?.scrollIntoView({block:"nearest",inline:"nearest"})}function oe(n,e){return document.querySelector(`td[data-r="${n}"][data-c="${e}"]`)}function Tt(){if(re)return re;let n=document.createElement("div");return n.className="autocomplete",n.style.display="none",n.addEventListener("mousedown",e=>{e.preventDefault()}),n.addEventListener("click",e=>{let t=e.target?.closest(".item");if(!t)return;let r=Number(t.getAttribute("data-idx")??-1);!Number.isFinite(r)||r<0||Oe(r,{moveNext:!1})}),document.body.appendChild(n),re=n,n}function de(){ae=!1,Q=[],X=0,re&&(re.style.display="none",re.replaceChildren())}function Mt(){if(Z)return Z;let n=document.createElement("div");return n.className="ctxmenu",n.style.display="none",n.addEventListener("mousedown",e=>{e.preventDefault()}),n.addEventListener("click",async e=>{let t=e.target?.closest(".item");if(!t)return;let r=String(t.getAttribute("data-action")??""),i=Se||Se===0?Se:null;ue();let a=document.getElementById("app");if(!a)return;let l=i!==null?i:g?g.r:0;if(r==="copy"){await kt();return}if(r==="cut"){await Nt(a);return}if(r==="paste"){await Rt(a);return}if(r==="delete"){Dt(a);return}if(r==="insertAbove"){tt(l);return}if(r==="insertBelow"){tt(l+1);return}}),document.body.appendChild(n),Z=n,n}function ue(){Se=null,Z&&(Z.style.display="none",Z.replaceChildren())}function je(){let n=String(he??"").trim().toLowerCase();if(U=[],G=-1,!!n){for(let e=0;e<u.length;e++)for(let t=0;t<q.length;t++)String(Ge(e,t)??"").toLowerCase().includes(n)&&U.push({r:e,c:t});U.length>0&&(G=0)}}function Ke(){let n=document.getElementById("tag-body");if(!n)return;let e=document.getElementById("find-count");if(e){let r=String(he??"").trim(),i=U.length,a=G>=0?G+1:0;e.textContent=i>0?`${a}/${i}`:"0/0",e.style.display=r?"":"none"}for(let r of Array.from(n.querySelectorAll("td[data-r][data-c]")))r.classList.remove("find-hit","find-current");if(U.length===0)return;let t=new Set(U.map(r=>`${r.r}:${r.c}`));for(let r of Array.from(n.querySelectorAll("td[data-r][data-c]"))){let i=Number(r.getAttribute("data-r")??-1),a=Number(r.getAttribute("data-c")??-1);t.has(`${i}:${a}`)&&r.classList.add("find-hit")}if(G>=0&&G<U.length){let r=U[G];document.querySelector(`td[data-r="${r.r}"][data-c="${r.c}"]`)?.classList.add("find-current")}}function St(n){if(U.length===0)return;let e=G;e<0?e=0:e=(e+n+U.length)%U.length,G=e;let t=U[G];y="cell",h={r:t.r,c:t.c},g={r:t.r,c:t.c};let r=document.getElementById("app");r&&A(r),Ke(),oe(t.r,t.c)?.scrollIntoView({block:"nearest",inline:"nearest"})}function At(n,e,t){Se=t;let r=Mt();r.replaceChildren();let i=(l,c)=>{let m=document.createElement("div");return m.className="item",m.setAttribute("data-action",c),m.textContent=l,m};r.appendChild(i("Cut","cut")),r.appendChild(i("Copy","copy")),r.appendChild(i("Paste","paste")),r.appendChild(i("Delete","delete")),r.appendChild(i("Insert row above","insertAbove")),r.appendChild(i("Insert row below","insertBelow"));let a=6;r.style.left=`${Math.max(a,n)}px`,r.style.top=`${Math.max(a,e)}px`,r.style.display=""}async function Lt(){try{if(navigator.clipboard&&typeof navigator.clipboard.readText=="function")return await navigator.clipboard.readText()}catch{}return null}async function kt(){let n=j();n&&await ke(xe(n))}async function Nt(n){let e=j();if(!(!e||!await ke(xe(e)))){if(y==="row"){if(ie(e.r0,e.r1),N(),u.length>0){let r=Math.max(0,Math.min(u.length-1,e.r0));y="row",h={r,c:0},g={r,c:0},A(n),H=!0,I(r,0)}else h=null,g=null;$();return}for(let r=e.r0;r<=e.r1;r++)for(let i=e.c0;i<=e.c1;i++)D(r,i,"");le(),N(),A(n),$()}}function Dt(n){let e=j();if(e){if(y==="row"){if(ie(e.r0,e.r1),N(),u.length>0){let t=Math.max(0,Math.min(u.length-1,e.r0));y="row",h={r:t,c:0},g={r:t,c:0},A(n),H=!0,I(t,0)}else h=null,g=null;$();return}for(let t=e.r0;t<=e.r1;t++)for(let r=e.c0;r<=e.c1;r++)D(t,r,"");le(),N(),A(n),$()}}async function Rt(n){let e=await Lt();if(e===null){window.alert("Paste is not available from the context menu here. Use Ctrl+V.");return}if(!g)return;if(y==="row"){let c=qe(e);if(c.length===0||(c.length>0&&st(c[0]??[])&&(c=c.slice(1)),c=c.filter(k=>k.some(M=>String(M??"").trim()!=="")),c.length===0))return;let m=j(),f=m?m.r1+1:u.length,v=Qe(),T=[];for(let k=0;k<c.length;k++){let M=Pe(f+k);if(M<0)continue;let B=c[k]??[],W=String(B[0]??""),R=Ye(W,v);D(M,0,R),D(M,1,String(B[1]??"")),D(M,2,String(B[2]??"")),D(M,3,String(B[3]??"")),T.push(M)}if(T.length===0)return;N(),y="row",h={r:T[0],c:0},g={r:T[T.length-1],c:0},A(n),H=!0,I(T[T.length-1],0),$();return}let t=qe(e),r=j(),i=!!r&&(r.r0!==r.r1||r.c0!==r.c1);if(y==="cell"&&i&&t.length===1&&(t[0]?.length??0)===1){let c=String(t[0]?.[0]??"");for(let m=r.r0;m<=r.r1;m++)for(let f=r.c0;f<=r.c1;f++)D(m,f,c);N(),A(n),$();return}let a=g.r,l=g.c;for(let c=0;c<t.length;c++){let m=a+c;for(;m>=u.length;)Ae();let f=t[c]??[];for(let v=0;v<f.length;v++){let T=l+v;T>=q.length||D(m,T,f[v]??"")}}N(),y="cell",h={r:a,c:l},g={r:Math.min(u.length-1,a+t.length-1),c:Math.min(q.length-1,l+(t[0]?.length??1)-1)},A(n),$()}function tt(n){z();let e=Math.max(0,Math.min(n,u.length)),t=Pe(e);if(t<0)return;N(),y="row",h={r:t,c:0},g={r:t,c:0};let r=document.getElementById("app");r&&A(r),H=!0,I(t,0),$()}function He(n,e,t){let r=Tt();ae=!0,Q=e,X=Math.max(0,Math.min(e.length-1,t)),r.replaceChildren();for(let a=0;a<e.length;a++){let l=document.createElement("div");l.className="item"+(a===X?" selected":""),l.setAttribute("data-idx",String(a)),l.textContent=e[a]??"",r.appendChild(l)}let i=n.getBoundingClientRect();r.style.left=`${Math.max(6,i.left)}px`,r.style.top=`${Math.max(6,i.bottom+2)}px`,r.style.minWidth=`${Math.max(180,i.width)}px`,r.style.display=""}function nt(n){if(!ae||Q.length===0){X=0;return}if(X=Math.max(0,Math.min(Q.length-1,n)),!re)return;let e=Array.from(re.querySelectorAll(".item"));for(let t=0;t<e.length;t++)e[t]?.classList.toggle("selected",t===X);e[X]?.scrollIntoView({block:"nearest"})}function $e(n){let e=String(n??"").trim();if(Ie.length===0)return[];let t=e.toUpperCase(),r;return t?r=Ie.filter(i=>String(i??"").toUpperCase().startsWith(t)):r=Ie.slice(),r.sort((i,a)=>i.toUpperCase().localeCompare(a.toUpperCase())),r.slice(0,30)}function Oe(n,e){if(!x||x.c!==1)return;let t=x.r;if(n<0||n>=Q.length)return;let r=String(Q[n]??"").trim();if(!r)return;let i=oe(t,1);if(i&&(i.textContent=r,D(t,1,r),de(),J(),e.moveNext)){z(),y="cell",h={r:t,c:2},g={r:t,c:2};let a=document.getElementById("app");a&&A(a),I(t,2)}}function z(){if(!x)return;let n=oe(x.r,x.c);n&&(n.contentEditable="false"),x=null,Xe=null,de(),ue()}function Bt(){if(!x)return;let n=x.r,e=x.c,t=Xe??"",r=oe(n,e);r&&(r.textContent=t),D(n,e,t),le(),Y!==void 0&&(window.clearTimeout(Y),Y=void 0),z(),J()}function Be(n,e){z(),ue(),x={r:n,c:e};let t=oe(n,e);if(t&&(Xe=String(t.textContent??""),t.contentEditable="true",t.focus(),Ve(t),e===1)){let r=$e(String(t.textContent??""));r.length>0?He(t,r,0):de()}}function Ve(n){try{let e=window.getSelection();if(!e)return;let t=document.createRange();t.selectNodeContents(n),t.collapse(!1),e.removeAllRanges(),e.addRange(t)}catch{}}function Ge(n,e){let t=u[n];if(!t)return"";let r=q[e]?.key;return r?String(t[r]??""):""}function D(n,e,t){let r=u[n];if(!r)return;let i=q[e]?.key;i&&(r[i]=t,i==="comment"&&Fe.add(r.rowKey))}function xe(n){let e=[];for(let t=n.r0;t<=n.r1;t++){let r=[];for(let i=n.c0;i<=n.c1;i++)r.push(Ge(t,i));e.push(r.join("	"))}return e.join(`
`)}function qe(n){let t=String(n??"").replace(/\r\n/g,`
`).replace(/\r/g,`
`).split(`
`);return t.length>0&&t[t.length-1]===""&&t.pop(),t.map(r=>r.split("	"))}function Qe(){let n=new Set;for(let e of u){let t=De(e.name);t&&n.add(t)}return n}function Ye(n,e){let t=String(n??"").trim();if(!t)return"";let r=/^(.*?)(\d+)$/.exec(t),i=r?r[1]??"":t,a=r?r[2]??"":"",l=a?a.length:0,c=a?Number.parseInt(a,10)+1:1,m=Number.isFinite(c)?c:1;for(let f=Math.max(1,m);f<1e6;f++){let v=l>0?String(f).padStart(l,"0"):String(f),T=i+v,k=De(T);if(!(!k||e.has(k)))return e.add(k),T}return i+String(Date.now())}function st(n){let e=t=>String(t??"").trim().toLowerCase().replace(/\s+/g,"");return n.length<q.length?!1:e(n[0]??"")==="name"&&e(n[1]??"")==="datatype"&&e(n[2]??"")==="address"&&e(n[3]??"")==="comment"}function ct(n){let e=/(>)(<)(\/?)/g,t=n.replace(e,`$1
$2$3`),r=0,i=[];for(let a of t.split(/\n/)){let l=a.trim();if(!l)continue;let c=/^<\//.test(l),m=/\/>$/.test(l)||/^<\?.*\?>$/.test(l),f=/^<[^!?/][^>]*>$/.test(l);c&&(r=Math.max(0,r-1)),i.push("  ".repeat(r)+l),f&&!m&&r++}return i.join(`
`)+`
`}function dt(){if(C)for(let n of u){let e=O.get(n.rowKey);if(!e)continue;let t=ve(e,"AttributeList");if(t&&(Ee(t,"Name",n.name),Ee(t,"DataTypeName",n.typeRef),Ee(t,"LogicalAddress",n.logicalAddress),Fe.has(n.rowKey))){let r=ve(e,"ObjectList");r||(r=C.createElement("ObjectList"),e.appendChild(r));let i=Array.from(e.getElementsByTagName("MultilingualText")).find(v=>(v.getAttribute("CompositionName")??"")==="Comment")??null;if(!i){i=C.createElement("MultilingualText"),i.setAttribute("ID",ne()),i.setAttribute("CompositionName","Comment");let v=C.createElement("ObjectList");i.appendChild(v),r.appendChild(i)}let a=ve(i,"ObjectList");a||(a=C.createElement("ObjectList"),i.appendChild(a));let l=lt(i);if(!l){l=C.createElement("MultilingualTextItem"),l.setAttribute("ID",ne()),l.setAttribute("CompositionName","Items");let v=C.createElement("AttributeList"),T=C.createElement("Culture");T.textContent=String(navigator.language??"en-US")||"en-US";let k=C.createElement("Text");v.appendChild(T),v.appendChild(k),l.appendChild(v),a.appendChild(l)}let c=ve(l,"AttributeList");c||(c=C.createElement("AttributeList"),l.appendChild(c));let m=c.getElementsByTagName("Culture")[0]??null;m||(m=C.createElement("Culture"),m.textContent=String(navigator.language??"en-US")||"en-US",c.appendChild(m));let f=c.getElementsByTagName("Text")[0]??null;f||(f=C.createElement("Text"),c.appendChild(f)),f.textContent=n.comment}}}function J(){Y!==void 0&&window.clearTimeout(Y),Y=window.setTimeout(()=>{if(Y=void 0,!!C)try{dt();let n=new XMLSerializer().serializeToString(C),e=(Le?Le+`
`:"")+ct(n);se=e,Ne.postMessage({kind:"apply",text:e})}catch{}},150)}function $(){if(Y!==void 0&&(window.clearTimeout(Y),Y=void 0),!!C)try{dt();let n=new XMLSerializer().serializeToString(C),e=(Le?Le+`
`:"")+ct(n);se=e,Ne.postMessage({kind:"apply",text:e})}catch{}}function Ee(n,e,t){let r=n.getElementsByTagName(e)[0];r&&(r.textContent=t)}function ut(){if(!C||!P)return null;let n=ge,e;if(n){e=n.cloneNode(!0);for(let a of Array.from(e.getElementsByTagName("*"))){let l=a;l.hasAttribute("ID")&&l.setAttribute("ID",ne())}e.setAttribute("ID",ne())}else{e=C.createElement("SW.Tags.PlcTag"),e.setAttribute("ID",ne()),e.setAttribute("CompositionName","Tags");let a=C.createElement("AttributeList"),l=C.createElement("DataTypeName");l.textContent="";let c=C.createElement("LogicalAddress");c.textContent="";let m=C.createElement("Name");m.textContent="",a.appendChild(l),a.appendChild(c),a.appendChild(m),e.appendChild(a);let f=C.createElement("ObjectList"),v=C.createElement("MultilingualText");v.setAttribute("ID",ne()),v.setAttribute("CompositionName","Comment");let T=C.createElement("ObjectList"),k=new Set;k.add("en-US");let M=String(navigator.language??"").trim();M&&k.add(M);for(let B of k){let W=C.createElement("MultilingualTextItem");W.setAttribute("ID",ne()),W.setAttribute("CompositionName","Items");let R=C.createElement("AttributeList"),ee=C.createElement("Culture");ee.textContent=B;let me=C.createElement("Text");R.appendChild(ee),R.appendChild(me),W.appendChild(R),T.appendChild(W)}v.appendChild(T),f.appendChild(v),e.appendChild(f)}let t=ve(e,"AttributeList");t&&(Ee(t,"Name",""),Ee(t,"DataTypeName",""),Ee(t,"LogicalAddress",""));let r=Array.from(e.getElementsByTagName("MultilingualText")).find(a=>(a.getAttribute("CompositionName")??"")==="Comment");if(r)for(let a of Array.from(r.getElementsByTagName("MultilingualTextItem"))){let l=a.getElementsByTagName("Text")[0];l&&(l.textContent="")}let i=e.getAttribute("ID")??ne();return e.setAttribute("ID",i),{el:e,row:{rowKey:i,name:"",typeRef:"",logicalAddress:"",comment:""}}}function Ae(){let n=ut();return!n||!P?-1:(P.appendChild(n.el),O.set(n.row.rowKey,n.el),u.push(n.row),ge||(ge=n.el),u.length-1)}function Pe(n){let e=ut();if(!e||!P)return-1;let t=Math.max(0,Math.min(n,u.length));if(t>=u.length)return Ae();let r=u[t]?.rowKey,i=r?O.get(r):null;return P.insertBefore(e.el,i??null),O.set(e.row.rowKey,e.el),u.splice(t,0,e.row),ge||(ge=e.el),t}function It(n,e,t){let r=Math.max(0,Math.min(n,e)),i=Math.min(u.length-1,Math.max(n,e));if(r>i)return[];let a=u.slice(r,i+1),l=Qe(),c=[];for(let m=0;m<a.length;m++){let f=a[m];if(!f)continue;let v=Pe(t+c.length);v<0||(D(v,0,Ye(f.name,l)),D(v,1,f.typeRef),D(v,2,f.logicalAddress),D(v,3,f.comment),c.push(v))}return c}function Kt(n,e,t){if(!P)return!1;let r=Math.max(0,Math.min(n,e)),i=Math.min(u.length-1,Math.max(n,e));if(r>i)return!1;if(t===-1){if(r<=0)return!1;let v=u[r-1]?.rowKey,T=v?O.get(v):null;if(!T)return!1;let k=u.slice(r,i+1);for(let M of k){let B=O.get(M.rowKey);B&&P.insertBefore(B,T)}return u.splice(r,i-r+1),u.splice(r-1,0,...k),!0}if(i>=u.length-1)return!1;let a=u[i+1]?.rowKey,l=a?O.get(a):null,c=u[r]?.rowKey,m=c?O.get(c):null;if(!l||!m)return!1;P.insertBefore(l,m);let f=u.splice(i+1,1)[0];return f?(u.splice(r,0,f),!0):!1}function ie(n,e){let t=Math.max(0,Math.min(n,e)),r=Math.min(u.length-1,Math.max(n,e));if(!(t>r))for(let i=r;i>=t;i--){let a=u[i]?.rowKey;if(!a){u.splice(i,1);continue}Fe.delete(a);let l=O.get(a);l&&l.parentNode&&l.parentNode.removeChild(l),O.delete(a),u.splice(i,1)}}function N(){let n=document.getElementById("app");if(!n)return;if(n.replaceChildren(),we){let o=document.createElement("div");o.className="notice",o.textContent=we,n.appendChild(o);return}let e=_e(u),t=ce.errors,r=ce.warnings,i=document.createElement("div");i.className="toolbar";let a=document.createElement("div");a.className="title",a.textContent="PLC Tag Table",i.appendChild(a);let l=document.createElement("input");l.type="search",l.className="filter",l.placeholder="Find...",l.value=he,l.addEventListener("input",()=>{he=String(l.value??""),je(),Ke()}),l.addEventListener("keydown",o=>{if(o.key==="Enter"){o.preventDefault(),St(o.shiftKey?-1:1),l.focus(),l.select();return}if(o.key==="Escape"){o.preventDefault(),he="",l.value="",je(),Ke();return}}),Je=l,i.appendChild(l);let c=document.createElement("span");c.className="badge",c.id="find-count",c.textContent="0/0",c.style.display=String(he??"").trim()?"":"none",i.appendChild(c);let m=document.createElement("span");m.className="badge",m.id="tag-count",m.textContent=`${u.length} tag(s)`,i.appendChild(m);let f=document.createElement("span");f.className="badge warn",f.id="dup-count",f.textContent=`${e.size} duplicate name(s)`,f.style.display=e.size>0?"":"none",i.appendChild(f);let v=document.createElement("span");if(v.className=t>0?"badge error":"badge warn",v.id="diag-count",v.textContent=t>0?`${t} error(s), ${r} warning(s)`:`${r} warning(s)`,v.style.display=t>0||r>0?"":"none",i.appendChild(v),V){let o=document.createElement("span");o.className="badge warn",o.id="op-error",o.title=V;let d=V.length>80?V.slice(0,77)+"...":V;o.textContent=d,o.addEventListener("click",()=>{V="",N()}),i.appendChild(o)}let T=document.createElement("div");T.className="spacer",i.appendChild(T);let k=document.createElement("button");k.textContent="Add row",k.addEventListener("click",()=>{let o=Ae();o<0||(N(),y="cell",h={r:o,c:0},g={r:o,c:0},A(n),I(o,0),J())}),i.appendChild(k);let M=document.createElement("button");M.textContent="Delete",M.addEventListener("click",()=>{let o=y==="row",d=j();if(d){if(ie(d.r0,d.r1),N(),u.length>0){let s=Math.max(0,Math.min(u.length-1,d.r0));y=o?"row":"cell",h={r:s,c:0},g={r:s,c:0},A(n),o&&(H=!0),I(s,0)}else h=null,g=null;J()}}),i.appendChild(M);let B=document.createElement("button");B.className="primary",B.textContent="Copy Expanded",B.addEventListener("click",()=>void Ht()),i.appendChild(B);let W=document.createElement("button");W.textContent="Open XML",W.addEventListener("click",()=>{Ne.postMessage({kind:"openAsXml"})}),i.appendChild(W),n.appendChild(i);let R=document.createElement("div");R.className="table-wrap";let ee=document.createElement("table"),me=document.createElement("thead"),Ce=document.createElement("tr"),fe=document.createElement("th");fe.className="col-gutter",fe.textContent="#",Ce.appendChild(fe);for(let o=0;o<q.length;o++){let d=document.createElement("th");d.textContent=q[o].label,d.style.width=q[o].width,Ce.appendChild(d)}me.appendChild(Ce),ee.appendChild(me);let pe=document.createElement("tbody");pe.id="tag-body";for(let o=0;o<u.length;o++){let d=document.createElement("tr");d.setAttribute("data-row",String(o)),d.setAttribute("data-row-key",u[o].rowKey);let s=Me.get(u[o].rowKey),b=De(u[o].name);b&&e.has(b)&&d.classList.add("dup"),s?.maxSeverity==="error"?d.classList.add("has-error"):s?.maxSeverity==="warning"&&d.classList.add("has-warn");let E=document.createElement("td");E.className="col-gutter",E.tabIndex=0,E.textContent=String(o+1),d.appendChild(E);for(let S=0;S<q.length;S++){let L=document.createElement("td");L.setAttribute("data-r",String(o)),L.setAttribute("data-c",String(S)),L.setAttribute("data-col",q[S].key),L.tabIndex=0,L.contentEditable=x&&x.r===o&&x.c===S?"true":"false",L.spellcheck=!1,L.textContent=Ge(o,S);let p=q[S].key,w=s?.byCol[p];w&&(w.severity==="error"||w.severity==="warning")&&(L.classList.add(w.severity==="error"?"cell-error":"cell-warn"),L.title=w.messages.join(`
`)),d.appendChild(L)}pe.appendChild(d)}if(ee.appendChild(pe),R.appendChild(ee),n.appendChild(R),u.length===0){let o=document.createElement("div");o.className="empty",o.textContent="No tags found.",n.appendChild(o)}R.addEventListener("mousedown",o=>{if(o.button!==0){H=!0;return}let d=o.target?.closest("td.col-gutter");if(d){z(),o.preventDefault();let S=d.closest("tr[data-row]");if(!S)return;let L=Number(S.getAttribute("data-row")??0),p=o.shiftKey&&h?h.r:L;y="row",h={r:p,c:0},g={r:L,c:0},A(n),H=!0,I(L,0);return}let s=o.target?.closest("td[data-r][data-c]");if(!s)return;let b=Number(s.getAttribute("data-r")??0),E=Number(s.getAttribute("data-c")??0);x&&(x.r!==b||x.c!==E)&&z(),o.shiftKey&&!(x&&s.isContentEditable)&&o.preventDefault(),y="cell",o.shiftKey&&h?g={r:b,c:E}:(h={r:b,c:E},g={r:b,c:E}),A(n),o.shiftKey&&!(x&&s.isContentEditable)&&(H=!0,I(b,E))}),R.addEventListener("contextmenu",o=>{let d=o.target?.closest("td[data-r][data-c]")??null;if(x&&d&&d.isContentEditable)return;let s=o.target?.closest("tr[data-row]")??null;if(!s){ue();return}o.preventDefault(),z();let b=Number(s.getAttribute("data-row")??0);if(o.target?.closest("td.col-gutter")??null)y="row",h={r:b,c:0},g={r:b,c:0};else if(d){let S=Number(d.getAttribute("data-c")??0),L=j();!!L&&L.r0<=b&&b<=L.r1&&L.c0<=S&&S<=L.c1||(y="cell",h={r:b,c:S},g={r:b,c:S})}A(n),At(o.clientX,o.clientY,b)}),R.addEventListener("dblclick",o=>{let d=o.target?.closest("td[data-r][data-c]");if(!d||o.button!==0)return;let s=Number(d.getAttribute("data-r")??0),b=Number(d.getAttribute("data-c")??0);y="cell",h={r:s,c:b},g={r:s,c:b},A(n),Be(s,b)}),R.addEventListener("focusin",o=>{if(H){H=!1;return}let d=o.target?.closest("td[data-r][data-c]");if(!d){z();return}let s=Number(d.getAttribute("data-r")??0),b=Number(d.getAttribute("data-c")??0);x&&(x.r!==s||x.c!==b)&&z(),y="cell",h={r:s,c:b},g={r:s,c:b},A(n)}),R.addEventListener("input",o=>{let d=o.target?.closest("td[data-r][data-c]");if(!d)return;let s=Number(d.getAttribute("data-r")??0),b=Number(d.getAttribute("data-c")??0);if(D(s,b,String(d.textContent??"")),le(),x&&x.r===s&&x.c===b&&b===1&&d.isContentEditable){let E=$e(String(d.textContent??""));E.length>0?He(d,E,0):de()}J()}),R.addEventListener("keydown",o=>{if((o.ctrlKey||o.metaKey)&&(o.key==="f"||o.key==="F")){o.preventDefault(),ue(),z();let p=Je;p&&(p.focus(),p.select());return}if(!g)return;let d=o.target?.closest("td[data-r][data-c]")??null,s=j(),b=!!s&&s.r0===s.r1&&s.c0===s.c1,E=b&&d&&Number(d.getAttribute("data-r")??-1)===s.r0&&Number(d.getAttribute("data-c")??-1)===s.c0,S=!!x&&!!d&&d.isContentEditable;if(!S&&s&&y==="row"&&(o.key==="ArrowUp"||o.key==="ArrowDown")){o.preventDefault();let p=o.key==="ArrowUp"?-1:1,w=Math.max(0,Math.min(u.length-1,g.r+p));o.shiftKey&&h?g={r:w,c:0}:(h={r:w,c:0},g={r:w,c:0}),A(n),H=!0,I(w,0);return}if(!S&&y==="cell"&&b&&!o.ctrlKey&&!o.metaKey&&!o.altKey&&o.key.length===1){o.preventDefault();let p=g.r,w=g.c;Be(p,w);let K=oe(p,w);if(!K)return;if(K.textContent=o.key,Ve(K),D(p,w,o.key),le(),w===1){let F=$e(String(K.textContent??""));F.length>0?He(K,F,0):de()}$();return}if((o.ctrlKey||o.metaKey)&&s&&y==="row"&&(o.key==="d"||o.key==="D")){o.preventDefault();let p=It(s.r0,s.r1,s.r1+1);if(p.length===0)return;N(),y="row",h={r:p[0],c:0},g={r:p[p.length-1],c:0},A(n),H=!0,I(p[p.length-1],0),$();return}if(o.altKey&&s&&y==="row"&&(o.key==="ArrowUp"||o.key==="ArrowDown")){o.preventDefault();let p=o.key==="ArrowUp"?-1:1;if(!Kt(s.r0,s.r1,p))return;y="row",h&&(h={r:h.r+p,c:0}),g={r:g.r+p,c:0},N(),A(n),H=!0,I(g.r,0),$();return}if((o.ctrlKey||o.metaKey)&&s&&y==="row"&&(o.key==="c"||o.key==="C")){o.preventDefault(),ke(xe(s));return}if((o.ctrlKey||o.metaKey)&&s&&y==="row"&&(o.key==="x"||o.key==="X")){if(o.preventDefault(),ke(xe(s)),ie(s.r0,s.r1),N(),u.length>0){let p=Math.max(0,Math.min(u.length-1,s.r0));y="row",h={r:p,c:0},g={r:p,c:0},A(n),H=!0,I(p,0)}else h=null,g=null;$();return}if((o.ctrlKey||o.metaKey)&&o.key==="Enter"){o.preventDefault();let p=Ae();p>=0&&(N(),y="cell",h={r:p,c:0},g={r:p,c:0},A(n),I(p,0),J());return}if((o.ctrlKey||o.metaKey)&&s&&y==="row"&&(o.key==="Backspace"||o.key==="Delete")){if(o.preventDefault(),ie(s.r0,s.r1),N(),u.length>0){let p=Math.max(0,Math.min(u.length-1,s.r0));y="row",h={r:p,c:0},g={r:p,c:0},A(n),H=!0,I(p,0)}else h=null,g=null;$();return}if(o.key==="c"&&(o.ctrlKey||o.metaKey)||o.key==="v"&&(o.ctrlKey||o.metaKey))return;let L=(p,w)=>{z();let K=Math.max(0,Math.min(u.length-1,g.r+p)),F=Math.max(0,Math.min(q.length-1,g.c+w));y="cell",h=o.shiftKey&&h?h:{r:K,c:F},g={r:K,c:F},A(n),H=!0,I(K,F)};switch(o.key){case"Escape":if(S){o.preventDefault(),Bt(),A(n);return}de(),ue();return;case"F2":if(y==="cell"&&E){o.preventDefault(),Be(g.r,g.c);return}return;case"ArrowUp":if(S&&x&&x.c===1&&ae&&Q.length>0){o.preventDefault(),nt(X-1);return}if(S&&E)return;o.preventDefault(),L(-1,0);return;case"ArrowDown":if(S&&x&&x.c===1&&ae&&Q.length>0){o.preventDefault(),nt(X+1);return}if(S&&E)return;o.preventDefault(),L(1,0);return;case"ArrowLeft":if(S&&E)return;o.preventDefault(),L(0,-1);return;case"ArrowRight":if(S&&E)return;o.preventDefault(),L(0,1);return;case"Enter":if(S&&x&&x.c===1&&ae&&Q.length>0){o.preventDefault(),Oe(X,{moveNext:!1});let p=oe(x.r,x.c);p&&Ve(p);return}if(S&&E){o.preventDefault(),z(),A(n),J();return}if(y==="cell"&&E){o.preventDefault(),Be(g.r,g.c);return}o.preventDefault(),L(1,0);return;case"Tab":if(S&&x&&x.c===1&&!o.shiftKey&&ae&&Q.length>0){o.preventDefault(),Oe(X,{moveNext:!0});return}o.preventDefault(),L(0,o.shiftKey?-1:1);return;case"Delete":case"Backspace":if(y==="cell"&&E)return;if(s){if(y==="cell"&&s.r0===s.r1&&s.c0===s.c1)return;if(o.preventDefault(),y==="row"){if(ie(s.r0,s.r1),N(),u.length>0){let p=Math.max(0,Math.min(u.length-1,s.r0));y="row",h={r:p,c:0},g={r:p,c:0},A(n),H=!0,I(p,0)}else h=null,g=null;$();return}y="cell";for(let p=s.r0;p<=s.r1;p++)for(let w=s.c0;w<=s.c1;w++)D(p,w,"");le(),N(),A(n),$()}return;default:break}}),R.addEventListener("copy",o=>{let d=j();if(!d)return;o.preventDefault();let s=xe(d);o.clipboardData?.setData("text/plain",s)}),R.addEventListener("cut",o=>{let d=j();if(!d)return;o.preventDefault();let s=xe(d);if(o.clipboardData?.setData("text/plain",s),y==="row"){if(ie(d.r0,d.r1),N(),u.length>0){let b=Math.max(0,Math.min(u.length-1,d.r0));y="row",h={r:b,c:0},g={r:b,c:0},A(n),H=!0,I(b,0)}else h=null,g=null;J();return}for(let b=d.r0;b<=d.r1;b++)for(let E=d.c0;E<=d.c1;E++){D(b,E,"");let S=R.querySelector(`td[data-r="${b}"][data-c="${E}"]`);S&&(S.textContent="")}le(),$()}),R.addEventListener("paste",o=>{if(!g)return;let d=o.target?.closest("td[data-r][data-c]")??null;if(x&&d&&d.isContentEditable)return;let s=o.clipboardData?.getData("text/plain");if(s===void 0)return;if(o.preventDefault(),y==="row"){let w=qe(s);if(w.length===0||(w.length>0&&st(w[0]??[])&&(w=w.slice(1)),w=w.filter(ye=>ye.some(te=>String(te??"").trim()!=="")),w.length===0))return;let K=j(),F=K?K.r1+1:u.length,be=Qe(),_=[];for(let ye=0;ye<w.length;ye++){let te=Pe(F+ye);if(te<0)continue;let Re=w[ye]??[],gt=String(Re[0]??""),mt=Ye(gt,be);D(te,0,mt),D(te,1,String(Re[1]??"")),D(te,2,String(Re[2]??"")),D(te,3,String(Re[3]??"")),_.push(te)}if(_.length===0)return;N(),y="row",h={r:_[0],c:0},g={r:_[_.length-1],c:0},A(n),H=!0,I(_[_.length-1],0),J();return}let b=qe(s),E=j(),S=!!E&&(E.r0!==E.r1||E.c0!==E.c1);if(y==="cell"&&S&&b.length===1&&(b[0]?.length??0)===1){let w=String(b[0]?.[0]??"");for(let K=E.r0;K<=E.r1;K++)for(let F=E.c0;F<=E.c1;F++)D(K,F,w);N(),A(n),$();return}let L=g.r,p=g.c;for(let w=0;w<b.length;w++){let K=L+w;for(;K>=u.length;)Ae();let F=b[w]??[];for(let be=0;be<F.length;be++){let _=p+be;_>=q.length||D(K,_,F[be]??"")}}N(),y="cell",h={r:L,c:p},g={r:Math.min(u.length-1,L+b.length-1),c:Math.min(q.length-1,p+(b[0]?.length??1)-1)},A(n),$()}),A(n),je(),Ke()}async function Ht(){if(_e(u).size>0){window.alert("Duplicate tag names found. Resolve duplicates before exporting.");return}let e=String(Date.now()),t=j(),r=t?u.slice(t.r0,t.r1+1):u,i=r.filter(a=>a.name.trim()&&a.typeRef.trim()).map(a=>({name:a.name.trim(),typeRef:a.typeRef.trim()}));if(i.length!==0)return new Promise(a=>{Te.set(e,async l=>{if(!l.ok){V=String(l.message??"")||"Expand failed.",window.alert(V),N(),a();return}let c=l.rows,m=l.truncated,f=new Map;for(let M of r)f.set(M.name.trim(),M);let v=[];v.push(["Name","DataType","Address","Comment","OriginName","OriginType"].join("	"));for(let M of c){let B=f.get(String(M.originName??"").trim()),W=B&&M.name===M.originName?B.logicalAddress:"",R=B?B.comment:"";v.push([String(M.name??""),String(M.typeRef??""),String(W??""),String(R??""),String(M.originName??""),String(M.originTypeRef??"")].join("	"))}m&&v.push(["# TRUNCATED","true","","","",""].join("	"));let T=v.join(`
`)+`
`;await ke(T)||window.alert("Failed to write to clipboard."),a()}),Ne.postMessage({kind:"requestExpand",requestId:e,tags:i,maxDepth:16,maxArrayElements:128})})}async function ke(n){let e=String(n??"");try{if(navigator.clipboard&&typeof navigator.clipboard.writeText=="function")return await navigator.clipboard.writeText(e),!0}catch{}try{let t=document.createElement("textarea");t.value=e,t.setAttribute("readonly","true"),t.style.position="fixed",t.style.top="0",t.style.left="0",t.style.width="2px",t.style.height="2px",t.style.opacity="0",document.body.appendChild(t),t.focus(),t.select();let r=document.execCommand("copy");return document.body.removeChild(t),r}catch{return!1}}var Te=new Map;function rt(n){se=String(n??"");let e=wt(se);if(u=e.rows,Le=e.prolog,we=e.error,C=e.doc,Fe.clear(),P=null,ge=null,O=new Map,C){Et(C);let t=C.getElementsByTagName("SW.Tags.PlcTagTable")[0]??null;if(t){P=Array.from(t.getElementsByTagName("ObjectList")).find(a=>a.parentNode===t)??null,P||(P=C.createElement("ObjectList"),t.appendChild(P));let i=P?Array.from(P.children).filter(a=>a?.tagName==="SW.Tags.PlcTag"):Array.from(C.getElementsByTagName("SW.Tags.PlcTag"));for(let a of i){let l=a.getAttribute("ID")??"";l&&O.set(l,a)}ge=i[0]??null}}if(!g)h=u.length>0?{r:0,c:0}:null,g=u.length>0?{r:0,c:0}:null;else{let t=Math.max(0,Math.min(u.length-1,g.r)),r=Math.max(0,Math.min(q.length-1,g.c));g={r:t,c:r},h={r:t,c:r}}if(we){at(we);return}it(),N()}function $t(){pt(),at("Waiting for document..."),document.addEventListener("mousedown",n=>{if(!Z||Z.style.display==="none")return;let e=n.target;e&&Z.contains(e)||ue()}),window.addEventListener("message",n=>{let e=n.data;if(!(!e||typeof e!="object")){if(e.kind==="init"){ft=String(e.uri??""),rt(String(e.text??""));return}if(e.kind==="update"){rt(String(e.text??""));return}if(e.kind==="diagnostics"){ze=Array.isArray(e.diagnostics)?e.diagnostics.map(t=>({message:String(t.message??""),severity:t.severity==="error"||t.severity==="warning"||t.severity==="info"||t.severity==="hint"?t.severity:"info",startLine:Number(t.startLine??0),startChar:Number(t.startChar??0),endLine:Number(t.endLine??0),endChar:Number(t.endChar??0),code:t.code?String(t.code):void 0})):[],it(),vt();return}if(e.kind==="typeRefs"){if(Ie=Array.isArray(e.items)?e.items.map(t=>String(t??"")).filter(t=>t.trim()!==""):[],x&&x.c===1){let t=oe(x.r,x.c);if(t&&t.isContentEditable){let r=$e(String(t.textContent??""));r.length>0?He(t,r,0):de()}}return}if(e.kind==="expanded"){let t=String(e.requestId??""),r=Te.get(t);Te.delete(t),r&&(V="",r({ok:!0,rows:Array.isArray(e.rows)?e.rows.map(i=>({name:String(i.name??""),typeRef:String(i.typeRef??""),originName:String(i.originName??""),originTypeRef:String(i.originTypeRef??"")})):[],truncated:!!e.truncated}));return}if(e.kind==="error"){let t=String(e.message??""),r=String(e.requestId??"");if(r){let i=Te.get(r);if(Te.delete(r),i){V=t,i({ok:!1,message:t});return}}V=t,N()}}}),Ne.postMessage({kind:"ready"})}$t();})();
