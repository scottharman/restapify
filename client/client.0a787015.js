function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function o(t){t.forEach(n)}function s(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function a(t,e,n,r){if(t){const o=c(t,e,n,r);return t[0](o)}}function c(t,n,r,o){return t[1]&&o?e(r.ctx.slice(),t[1](o(n))):r.ctx}function l(t,e,n,r,o,s,i){const a=function(t,e,n,r){if(t[2]&&r){const o=t[2](r(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let r=0;r<n;r+=1)t[r]=e.dirty[r]|o[r];return t}return e.dirty|o}return e.dirty}(e,r,o,s);if(a){const o=c(e,n,r,i);t.p(o,a)}}function f(t){return null==t?"":t}const u=(t,e)=>Object.prototype.hasOwnProperty.call(t,e);function h(t,e){t.appendChild(e)}function d(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function m(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function g(t){return document.createElement(t)}function C(t,e){const n={};for(const r in t)u(t,r)&&-1===e.indexOf(r)&&(n[r]=t[r]);return n}function A(t){return document.createTextNode(t)}function y(){return A(" ")}function k(){return A("")}function v(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function b(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function B(t){return Array.from(t.childNodes)}function E(t,e,n,r){for(let r=0;r<t.length;r+=1){const o=t[r];if(o.nodeName===e){let e=0;const s=[];for(;e<o.attributes.length;){const t=o.attributes[e++];n[t.name]||s.push(t.name)}for(let t=0;t<s.length;t++)o.removeAttribute(s[t]);return t.splice(r,1)[0]}}return r?function(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}(e):g(e)}function $(t,e){for(let n=0;n<t.length;n+=1){const r=t[n];if(3===r.nodeType)return r.data=""+e,t.splice(n,1)[0]}return A(e)}function D(t){return $(t," ")}function w(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function x(t,e,n){t.classList[n?"add":"remove"](e)}function L(t,e=document.body){return Array.from(e.querySelectorAll(t))}class F{constructor(t=null){this.a=t,this.e=this.n=null}m(t,e,n=null){this.e||(this.e=g(e.nodeName),this.t=e,this.h(t)),this.i(n)}h(t){this.e.innerHTML=t,this.n=Array.from(this.e.childNodes)}i(t){for(let e=0;e<this.n.length;e+=1)d(this.t,this.n[e],t)}p(t){this.d(),this.h(t),this.i(this.a)}d(){this.n.forEach(p)}}let _;function j(t){_=t}function S(){if(!_)throw new Error("Function called outside component initialization");return _}function z(t){S().$$.on_mount.push(t)}const R=[],M=[],N=[],P=[],I=Promise.resolve();let O=!1;function T(t){N.push(t)}let q=!1;const U=new Set;function H(){if(!q){q=!0;do{for(let t=0;t<R.length;t+=1){const e=R[t];j(e),G(e.$$)}for(j(null),R.length=0;M.length;)M.pop()();for(let t=0;t<N.length;t+=1){const e=N[t];U.has(e)||(U.add(e),e())}N.length=0}while(R.length);for(;P.length;)P.pop()();O=!1,q=!1,U.clear()}}function G(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(T)}}const J=new Set;let V;function Z(){V={r:0,c:[],p:V}}function K(){V.r||o(V.c),V=V.p}function Y(t,e){t&&t.i&&(J.delete(t),t.i(e))}function W(t,e,n,r){if(t&&t.o){if(J.has(t))return;J.add(t),V.c.push((()=>{J.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}}const Q="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function X(t,e){const n={},r={},o={$$scope:1};let s=t.length;for(;s--;){const i=t[s],a=e[s];if(a){for(const t in i)t in a||(r[t]=1);for(const t in a)o[t]||(n[t]=a[t],o[t]=1);t[s]=a}else for(const t in i)o[t]=1}for(const t in r)t in n||(n[t]=void 0);return n}function tt(t){return"object"==typeof t&&null!==t?t:{}}function et(t){t&&t.c()}function nt(t,e){t&&t.l(e)}function rt(t,e,r){const{fragment:i,on_mount:a,on_destroy:c,after_update:l}=t.$$;i&&i.m(e,r),T((()=>{const e=a.map(n).filter(s);c?c.push(...e):o(e),t.$$.on_mount=[]})),l.forEach(T)}function ot(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function st(t,e){-1===t.$$.dirty[0]&&(R.push(t),O||(O=!0,I.then(H)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function it(e,n,s,i,a,c,l=[-1]){const f=_;j(e);const u=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:a,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:r(),dirty:l,skip_bound:!1};let h=!1;if(u.ctx=s?s(e,n.props||{},((t,n,...r)=>{const o=r.length?r[0]:n;return u.ctx&&a(u.ctx[t],u.ctx[t]=o)&&(!u.skip_bound&&u.bound[t]&&u.bound[t](o),h&&st(e,t)),n})):[],u.update(),h=!0,o(u.before_update),u.fragment=!!i&&i(u.ctx),n.target){if(n.hydrate){const t=B(n.target);u.fragment&&u.fragment.l(t),t.forEach(p)}else u.fragment&&u.fragment.c();n.intro&&Y(e.$$.fragment),rt(e,n.target,n.anchor),H()}j(f)}class at{$destroy(){ot(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const ct=[];function lt(e,n=t){let r;const o=[];function s(t){if(i(e,t)&&(e=t,r)){const t=!ct.length;for(let t=0;t<o.length;t+=1){const n=o[t];n[1](),ct.push(n,e)}if(t){for(let t=0;t<ct.length;t+=2)ct[t][0](ct[t+1]);ct.length=0}}}return{set:s,update:function(t){s(t(e))},subscribe:function(i,a=t){const c=[i,a];return o.push(c),1===o.length&&(r=n(s)||t),i(e),()=>{const t=o.indexOf(c);-1!==t&&o.splice(t,1),0===o.length&&(r(),r=null)}}}}const ft={};function ut(e){let n,r,o,s,i,a,c,l,f,u,m,C,k,v,w,x,L,F,_,j,S,z,R,M,N,P;return{c(){n=g("nav"),r=g("div"),o=g("a"),s=g("img"),a=y(),c=g("h1"),l=A("Restapify"),f=y(),u=g("ul"),m=g("li"),C=g("a"),k=A("Docs"),v=y(),w=g("li"),x=g("a"),L=A("GitHub"),F=y(),_=g("li"),j=g("a"),S=g("img"),R=y(),M=g("li"),N=g("iframe"),this.h()},l(t){n=E(t,"NAV",{class:!0});var e=B(n);r=E(e,"DIV",{class:!0});var i=B(r);o=E(i,"A",{id:!0,class:!0,href:!0});var h=B(o);s=E(h,"IMG",{src:!0,alt:!0,class:!0}),a=D(h),c=E(h,"H1",{class:!0});var d=B(c);l=$(d,"Restapify"),d.forEach(p),h.forEach(p),f=D(i),u=E(i,"UL",{class:!0});var g=B(u);m=E(g,"LI",{class:!0});var A=B(m);C=E(A,"A",{class:!0,href:!0});var y=B(C);k=$(y,"Docs"),y.forEach(p),A.forEach(p),v=D(g),w=E(g,"LI",{class:!0});var b=B(w);x=E(b,"A",{class:!0,href:!0,target:!0});var z=B(x);L=$(z,"GitHub"),z.forEach(p),b.forEach(p),F=D(g),_=E(g,"LI",{class:!0});var P=B(_);j=E(P,"A",{class:!0,href:!0});var I=B(j);S=E(I,"IMG",{src:!0,target:!0,alt:!0}),I.forEach(p),P.forEach(p),R=D(g),M=E(g,"LI",{class:!0});var O=B(M);N=E(O,"IFRAME",{src:!0,frameborder:!0,scrolling:!0,width:!0,height:!0,title:!0}),B(N).forEach(p),O.forEach(p),g.forEach(p),i.forEach(p),e.forEach(p),this.h()},h(){s.src!==(i="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20viewBox%3D%22-84.96%20112.15%201139.43%20855.7%22%3E%3Cdesc%3ECreated%20with%20Fabric.js%204.2.0%3C%2Fdesc%3E%3Cdefs%3E%3C%2Fdefs%3E%3Cg%20transform%3D%22matrix%281%200%200%201%20540%20540%29%22%20id%3D%22b13d279c-a7c8-43f8-8418-b25b69802bc2%22%3E%3C%2Fg%3E%3Cg%20transform%3D%22matrix%281.05%200%200%201.05%20484.45%20540%29%22%3E%3Cg%20style%3D%22%22%20vector-effect%3D%22non-scaling-stroke%22%3E%20%20%3Cg%20transform%3D%22matrix%281.14%200%200%201.14%20201.2%2081.18%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%28255%2C219%2C144%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-165.62%2C%20-226.03%29%22%20d%3D%22M%20-94.1058%20347.385%20C%20-173.166%20264.173%20-129.411%20152.842%20-11.8513%20152.738%20C%2038.2839%20152.698%2081.5833%20146.74%20126.879%20119.868%20C%20191.565%2081.4719%20231.015%2020.0446%20315.697%2030.4263%20C%20441.73%2045.7432%20496.13%20170.706%20447.911%20280.464%20C%20414.698%20356.026%20345.173%20393.703%20268.301%20409.388%20C%20162.153%20431.013%20-12.602%20436.468%20-94.1058%20347.385%20Z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%28-0.7%200.9%20-0.9%20-0.7%20-155.41%200%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%28214%2C235%2C244%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-165.62%2C%20-226.03%29%22%20d%3D%22M%20-94.1058%20347.385%20C%20-173.166%20264.173%20-129.411%20152.842%20-11.8513%20152.738%20C%2038.2839%20152.698%2081.5833%20146.74%20126.879%20119.868%20C%20191.565%2081.4719%20231.015%2020.0446%20315.697%2030.4263%20C%20441.73%2045.7432%20496.13%20170.706%20447.911%20280.464%20C%20414.698%20356.026%20345.173%20393.703%20268.301%20409.388%20C%20162.153%20431.013%20-12.602%20436.468%20-94.1058%20347.385%20Z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%2847.86%200%200%2047.86%2065.11%20-68.26%29%22%3E%3Cpath%20style%3D%22stroke%3A%20rgb%280%2C0%2C0%29%3B%20stroke-width%3A%200%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-8%2C%20-7.5%29%22%20d%3D%22M%200.54%203.87%20L%200.5%203%20C%200.5%201.895430500338413%201.395430500338413%201%202.5%201%20L%206.172000000000001%201%20C%206.702389626957629%201.0001132748109898%207.211014537285083%201.2109012503780958%207.585999999999999%201.5859999999999992%20L%208.414%202.4139999999999997%20C%208.788985462714916%202.7890987496219033%209.297610373042371%202.9998867251890093%209.828%203%20L%2013.809999999999999%203%20C%2014.371944507063548%202.99994181344107%2014.907988548753293%203.2362943728740303%2015.286958175882914%203.651220455589744%20C%2015.665927803012535%204.066146538305458%2015.852855981174343%204.6213614545232184%2015.802%205.180999999999999%20L%2015.165%2012.181000000000001%20C%2015.071411322559975%2013.21088633969406%2014.208129849263837%2013.999590006155977%2013.174%2014%20L%202.826%2014%20C%201.7918701507361623%2013.999590006155977%200.9285886774400236%2013.21088633969406%200.835%2012.181000000000001%20L%200.19799999999999995%205.181000000000001%20C%200.15538623098938223%204.717782492347585%200.2763940224250574%204.254273115795729%200.5400000000000003%203.8710000000000004%20z%20M%202.19%204%20C%201.9091230222874496%203.9999836431888887%201.6411881700891677%204.1180921977290375%201.4517202526954953%204.32544162539882%20C%201.262252335301823%204.532791053068602%201.1687210714867386%204.810262886535049%201.194%205.09%20L%201.831%2012.09%20C%201.8775341360619322%2012.604950220712128%202.3089517251732294%2012.99951304090437%202.8260000000000005%2013%20L%2013.174000000000001%2013%20C%2013.691048274826771%2012.99951304090437%2014.122465863938068%2012.604950220712128%2014.169%2012.09%20L%2014.806000000000001%205.09%20C%2014.831278928513262%204.810262886535048%2014.737747664698178%204.5327910530686015%2014.548279747304505%204.3254416253988195%20C%2014.358811829910833%204.1180921977290375%2014.09087697771255%203.9999836431888887%2013.81%204%20L%202.19%204%20z%20M%206.880000000000001%202.293%20C%206.692262313828545%202.105205444372648%206.437541315719522%201.9997912460026708%206.171999999999999%202%20L%202.5%202%20C%201.9550509222374148%201.9999016279796986%201.5103540237673267%202.436149285378855%201.5%202.981%20L%201.506%203.12%20C%201.72%203.042%201.95%203%202.19%203%20L%207.586%203%20L%206.8790000000000004%202.293%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%281.73%200%200%201.73%2065.07%20-59.59%29%22%3E%3Cg%20style%3D%22%22%20vector-effect%3D%22non-scaling-stroke%22%3E%20%20%3Cg%20transform%3D%22matrix%282.5%200%200%202.5%20-94.57%200.19%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-161.51%2C%20-196.14%29%22%20d%3D%22M%20161.509%20212.413%20C%20157.24099999999999%20212.413%20153.783%20208.954%20153.783%20204.687%20L%20153.783%20187.586%20C%20153.783%20183.31900000000002%20157.24099999999999%20179.86%20161.509%20179.86%20C%20165.777%20179.86%20169.23499999999999%20183.31900000000002%20169.23499999999999%20187.586%20L%20169.23499999999999%20204.687%20C%20169.236%20208.954%20165.777%20212.413%20161.509%20212.413%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%282.5%200%200%202.5%2094.58%20-0.19%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-161.51%2C%20-196.14%29%22%20d%3D%22M%20161.509%20212.413%20C%20157.24099999999999%20212.413%20153.783%20208.954%20153.783%20204.687%20L%20153.783%20187.586%20C%20153.783%20183.31900000000002%20157.24099999999999%20179.86%20161.509%20179.86%20C%20165.777%20179.86%20169.23499999999999%20183.31900000000002%20169.23499999999999%20187.586%20L%20169.23499999999999%20204.687%20C%20169.236%20208.954%20165.777%20212.413%20161.509%20212.413%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%282.5%20-0.77%200.77%202.5%2064.87%2083.22%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-256%2C%20-208.65%29%22%20d%3D%22M%20255.999%20221.541%20C%20244.68%20221.541%20234.059%20216.81799999999998%20226.85999999999999%20208.581%20C%20224.051%20205.368%20224.379%20200.488%20227.59099999999998%20197.679%20C%20230.80399999999997%20194.87%20235.68499999999997%20195.197%20238.49299999999997%20198.41%20C%20242.75899999999996%20203.289%20249.13899999999995%20206.087%20255.99799999999996%20206.087%20C%20262.85799999999995%20206.087%20269.23799999999994%20203.289%20273.50199999999995%20198.411%20C%20276.30899999999997%20195.197%20281.19199999999995%20194.869%20284.40299999999996%20197.679%20C%20287.616%20200.487%20287.94499999999994%20205.368%20285.135%20208.581%20C%20277.939%20216.818%20267.318%20221.541%20255.999%20221.541%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")&&b(s,"src","data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20version%3D%221.1%22%20viewBox%3D%22-84.96%20112.15%201139.43%20855.7%22%3E%3Cdesc%3ECreated%20with%20Fabric.js%204.2.0%3C%2Fdesc%3E%3Cdefs%3E%3C%2Fdefs%3E%3Cg%20transform%3D%22matrix%281%200%200%201%20540%20540%29%22%20id%3D%22b13d279c-a7c8-43f8-8418-b25b69802bc2%22%3E%3C%2Fg%3E%3Cg%20transform%3D%22matrix%281.05%200%200%201.05%20484.45%20540%29%22%3E%3Cg%20style%3D%22%22%20vector-effect%3D%22non-scaling-stroke%22%3E%20%20%3Cg%20transform%3D%22matrix%281.14%200%200%201.14%20201.2%2081.18%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%28255%2C219%2C144%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-165.62%2C%20-226.03%29%22%20d%3D%22M%20-94.1058%20347.385%20C%20-173.166%20264.173%20-129.411%20152.842%20-11.8513%20152.738%20C%2038.2839%20152.698%2081.5833%20146.74%20126.879%20119.868%20C%20191.565%2081.4719%20231.015%2020.0446%20315.697%2030.4263%20C%20441.73%2045.7432%20496.13%20170.706%20447.911%20280.464%20C%20414.698%20356.026%20345.173%20393.703%20268.301%20409.388%20C%20162.153%20431.013%20-12.602%20436.468%20-94.1058%20347.385%20Z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%28-0.7%200.9%20-0.9%20-0.7%20-155.41%200%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%28214%2C235%2C244%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-165.62%2C%20-226.03%29%22%20d%3D%22M%20-94.1058%20347.385%20C%20-173.166%20264.173%20-129.411%20152.842%20-11.8513%20152.738%20C%2038.2839%20152.698%2081.5833%20146.74%20126.879%20119.868%20C%20191.565%2081.4719%20231.015%2020.0446%20315.697%2030.4263%20C%20441.73%2045.7432%20496.13%20170.706%20447.911%20280.464%20C%20414.698%20356.026%20345.173%20393.703%20268.301%20409.388%20C%20162.153%20431.013%20-12.602%20436.468%20-94.1058%20347.385%20Z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%2847.86%200%200%2047.86%2065.11%20-68.26%29%22%3E%3Cpath%20style%3D%22stroke%3A%20rgb%280%2C0%2C0%29%3B%20stroke-width%3A%200%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-8%2C%20-7.5%29%22%20d%3D%22M%200.54%203.87%20L%200.5%203%20C%200.5%201.895430500338413%201.395430500338413%201%202.5%201%20L%206.172000000000001%201%20C%206.702389626957629%201.0001132748109898%207.211014537285083%201.2109012503780958%207.585999999999999%201.5859999999999992%20L%208.414%202.4139999999999997%20C%208.788985462714916%202.7890987496219033%209.297610373042371%202.9998867251890093%209.828%203%20L%2013.809999999999999%203%20C%2014.371944507063548%202.99994181344107%2014.907988548753293%203.2362943728740303%2015.286958175882914%203.651220455589744%20C%2015.665927803012535%204.066146538305458%2015.852855981174343%204.6213614545232184%2015.802%205.180999999999999%20L%2015.165%2012.181000000000001%20C%2015.071411322559975%2013.21088633969406%2014.208129849263837%2013.999590006155977%2013.174%2014%20L%202.826%2014%20C%201.7918701507361623%2013.999590006155977%200.9285886774400236%2013.21088633969406%200.835%2012.181000000000001%20L%200.19799999999999995%205.181000000000001%20C%200.15538623098938223%204.717782492347585%200.2763940224250574%204.254273115795729%200.5400000000000003%203.8710000000000004%20z%20M%202.19%204%20C%201.9091230222874496%203.9999836431888887%201.6411881700891677%204.1180921977290375%201.4517202526954953%204.32544162539882%20C%201.262252335301823%204.532791053068602%201.1687210714867386%204.810262886535049%201.194%205.09%20L%201.831%2012.09%20C%201.8775341360619322%2012.604950220712128%202.3089517251732294%2012.99951304090437%202.8260000000000005%2013%20L%2013.174000000000001%2013%20C%2013.691048274826771%2012.99951304090437%2014.122465863938068%2012.604950220712128%2014.169%2012.09%20L%2014.806000000000001%205.09%20C%2014.831278928513262%204.810262886535048%2014.737747664698178%204.5327910530686015%2014.548279747304505%204.3254416253988195%20C%2014.358811829910833%204.1180921977290375%2014.09087697771255%203.9999836431888887%2013.81%204%20L%202.19%204%20z%20M%206.880000000000001%202.293%20C%206.692262313828545%202.105205444372648%206.437541315719522%201.9997912460026708%206.171999999999999%202%20L%202.5%202%20C%201.9550509222374148%201.9999016279796986%201.5103540237673267%202.436149285378855%201.5%202.981%20L%201.506%203.12%20C%201.72%203.042%201.95%203%202.19%203%20L%207.586%203%20L%206.8790000000000004%202.293%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%281.73%200%200%201.73%2065.07%20-59.59%29%22%3E%3Cg%20style%3D%22%22%20vector-effect%3D%22non-scaling-stroke%22%3E%20%20%3Cg%20transform%3D%22matrix%282.5%200%200%202.5%20-94.57%200.19%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-161.51%2C%20-196.14%29%22%20d%3D%22M%20161.509%20212.413%20C%20157.24099999999999%20212.413%20153.783%20208.954%20153.783%20204.687%20L%20153.783%20187.586%20C%20153.783%20183.31900000000002%20157.24099999999999%20179.86%20161.509%20179.86%20C%20165.777%20179.86%20169.23499999999999%20183.31900000000002%20169.23499999999999%20187.586%20L%20169.23499999999999%20204.687%20C%20169.236%20208.954%20165.777%20212.413%20161.509%20212.413%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%282.5%200%200%202.5%2094.58%20-0.19%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-161.51%2C%20-196.14%29%22%20d%3D%22M%20161.509%20212.413%20C%20157.24099999999999%20212.413%20153.783%20208.954%20153.783%20204.687%20L%20153.783%20187.586%20C%20153.783%20183.31900000000002%20157.24099999999999%20179.86%20161.509%20179.86%20C%20165.777%20179.86%20169.23499999999999%20183.31900000000002%20169.23499999999999%20187.586%20L%20169.23499999999999%20204.687%20C%20169.236%20208.954%20165.777%20212.413%20161.509%20212.413%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%20%20%3Cg%20transform%3D%22matrix%282.5%20-0.77%200.77%202.5%2064.87%2083.22%29%22%3E%3Cpath%20style%3D%22stroke%3A%20none%3B%20stroke-width%3A%201%3B%20stroke-dasharray%3A%20none%3B%20stroke-linecap%3A%20butt%3B%20stroke-dashoffset%3A%200%3B%20stroke-linejoin%3A%20miter%3B%20stroke-miterlimit%3A%204%3B%20fill%3A%20rgb%280%2C0%2C0%29%3B%20fill-rule%3A%20nonzero%3B%20opacity%3A%201%3B%22%20vector-effect%3D%22non-scaling-stroke%22%20transform%3D%22%20translate%28-256%2C%20-208.65%29%22%20d%3D%22M%20255.999%20221.541%20C%20244.68%20221.541%20234.059%20216.81799999999998%20226.85999999999999%20208.581%20C%20224.051%20205.368%20224.379%20200.488%20227.59099999999998%20197.679%20C%20230.80399999999997%20194.87%20235.68499999999997%20195.197%20238.49299999999997%20198.41%20C%20242.75899999999996%20203.289%20249.13899999999995%20206.087%20255.99799999999996%20206.087%20C%20262.85799999999995%20206.087%20269.23799999999994%20203.289%20273.50199999999995%20198.411%20C%20276.30899999999997%20195.197%20281.19199999999995%20194.869%20284.40299999999996%20197.679%20C%20287.616%20200.487%20287.94499999999994%20205.368%20285.135%20208.581%20C%20277.939%20216.818%20267.318%20221.541%20255.999%20221.541%20z%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"),b(s,"alt","Restapify icon"),b(s,"class","svelte-c735tm"),b(c,"class","d-none d-md-block ms-1 mb-0 fs-4 svelte-c735tm"),b(o,"id","brand"),b(o,"class","p-0 d-flex align-contents-center link-dark svelte-c735tm"),b(o,"href","/"),b(C,"class","nav-link svelte-c735tm"),b(C,"href","/docs"),b(m,"class","nav-item svelte-c735tm"),b(x,"class","nav-link svelte-c735tm"),b(x,"href","https://github.com/johannchopin/restapify"),b(x,"target","_blank"),b(w,"class","nav-item svelte-c735tm"),S.src!==(z="https://img.shields.io/codecov/c/github/johannchopin/restapify")&&b(S,"src","https://img.shields.io/codecov/c/github/johannchopin/restapify"),b(S,"target","_blank"),b(S,"alt","codecov"),b(j,"class","nav-link svelte-c735tm"),b(j,"href","https://codecov.io/gh/johannchopin/restapify"),b(_,"class","nav-item d-none d-md-block ms-3 svelte-c735tm"),N.src!==(P="https://ghbtns.com/github-btn.html?user=johannchopin&repo=restapify&type=star&count=true&v=2")&&b(N,"src","https://ghbtns.com/github-btn.html?user=johannchopin&repo=restapify&type=star&count=true&v=2"),b(N,"frameborder","0"),b(N,"scrolling","0"),b(N,"width","100"),b(N,"height","20"),b(N,"title","GitHub"),b(M,"class","nav-item d-flex align-items-center svelte-c735tm"),b(u,"class","d-flex ms-auto mb-0"),b(r,"class","container-fluid"),b(n,"class","navbar navbar-expand-lg px-md-4 pt-0 pb-0 navbar-light bg-light shadow svelte-c735tm")},m(t,e){d(t,n,e),h(n,r),h(r,o),h(o,s),h(o,a),h(o,c),h(c,l),h(r,f),h(r,u),h(u,m),h(m,C),h(C,k),h(u,v),h(u,w),h(w,x),h(x,L),h(u,F),h(u,_),h(_,j),h(j,S),h(u,R),h(u,M),h(M,N)},p:t,i:t,o:t,d(t){t&&p(n)}}}class ht extends at{constructor(t){super(),it(this,t,null,ut,i,{})}}function dt(t){let e,n,r,o,s,i,c;e=new ht({});const f=t[1].default,u=a(f,t,t[0],null);return{c(){et(e.$$.fragment),n=y(),r=g("script"),s=y(),i=g("main"),u&&u.c(),this.h()},l(t){nt(e.$$.fragment,t),n=D(t);const o=L('[data-svelte="svelte-c1qtge"]',document.head);r=E(o,"SCRIPT",{src:!0,integrity:!0,crossorigin:!0}),B(r).forEach(p),o.forEach(p),s=D(t),i=E(t,"MAIN",{class:!0});var a=B(i);u&&u.l(a),a.forEach(p),this.h()},h(){r.src!==(o="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/highlight.min.js")&&b(r,"src","https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/highlight.min.js"),b(r,"integrity","sha512-zol3kFQ5tnYhL7PzGt0LnllHHVWRGt2bTCIywDiScVvLIlaDOVJ6sPdJTVi0m3rA660RT+yZxkkRzMbb1L8Zkw=="),b(r,"crossorigin","anonymous"),b(i,"class","svelte-1xuhwr1")},m(t,o){rt(e,t,o),d(t,n,o),h(document.head,r),d(t,s,o),d(t,i,o),u&&u.m(i,null),c=!0},p(t,[e]){u&&u.p&&1&e&&l(u,f,t,t[0],e,null,null)},i(t){c||(Y(e.$$.fragment,t),Y(u,t),c=!0)},o(t){W(e.$$.fragment,t),W(u,t),c=!1},d(t){ot(e,t),t&&p(n),p(r),t&&p(s),t&&p(i),u&&u.d(t)}}}function pt(t,e,n){let{$$slots:r={},$$scope:o}=e;return t.$$set=t=>{"$$scope"in t&&n(0,o=t.$$scope)},[o,r]}class mt extends at{constructor(t){super(),it(this,t,pt,dt,i,{})}}function gt(t){let e,n,r=t[1].stack+"";return{c(){e=g("pre"),n=A(r)},l(t){e=E(t,"PRE",{});var o=B(e);n=$(o,r),o.forEach(p)},m(t,r){d(t,e,r),h(e,n)},p(t,e){2&e&&r!==(r=t[1].stack+"")&&w(n,r)},d(t){t&&p(e)}}}function Ct(e){let n,r,o,s,i,a,c,l,f,u=e[1].message+"";document.title=n=e[0];let m=e[2]&&e[1].stack&&gt(e);return{c(){r=y(),o=g("h1"),s=A(e[0]),i=y(),a=g("p"),c=A(u),l=y(),m&&m.c(),f=k(),this.h()},l(t){L('[data-svelte="svelte-1o9r2ue"]',document.head).forEach(p),r=D(t),o=E(t,"H1",{class:!0});var n=B(o);s=$(n,e[0]),n.forEach(p),i=D(t),a=E(t,"P",{class:!0});var h=B(a);c=$(h,u),h.forEach(p),l=D(t),m&&m.l(t),f=k(),this.h()},h(){b(o,"class","svelte-8od9u6"),b(a,"class","svelte-8od9u6")},m(t,e){d(t,r,e),d(t,o,e),h(o,s),d(t,i,e),d(t,a,e),h(a,c),d(t,l,e),m&&m.m(t,e),d(t,f,e)},p(t,[e]){1&e&&n!==(n=t[0])&&(document.title=n),1&e&&w(s,t[0]),2&e&&u!==(u=t[1].message+"")&&w(c,u),t[2]&&t[1].stack?m?m.p(t,e):(m=gt(t),m.c(),m.m(f.parentNode,f)):m&&(m.d(1),m=null)},i:t,o:t,d(t){t&&p(r),t&&p(o),t&&p(i),t&&p(a),t&&p(l),m&&m.d(t),t&&p(f)}}}function At(t,e,n){let{status:r}=e,{error:o}=e;return t.$$set=t=>{"status"in t&&n(0,r=t.status),"error"in t&&n(1,o=t.error)},[r,o,false]}class yt extends at{constructor(t){super(),it(this,t,At,Ct,i,{status:0,error:1})}}function kt(t){let n,r,o;const s=[t[4].props];var i=t[4].component;function a(t){let n={};for(let t=0;t<s.length;t+=1)n=e(n,s[t]);return{props:n}}return i&&(n=new i(a())),{c(){n&&et(n.$$.fragment),r=k()},l(t){n&&nt(n.$$.fragment,t),r=k()},m(t,e){n&&rt(n,t,e),d(t,r,e),o=!0},p(t,e){const o=16&e?X(s,[tt(t[4].props)]):{};if(i!==(i=t[4].component)){if(n){Z();const t=n;W(t.$$.fragment,1,0,(()=>{ot(t,1)})),K()}i?(n=new i(a()),et(n.$$.fragment),Y(n.$$.fragment,1),rt(n,r.parentNode,r)):n=null}else i&&n.$set(o)},i(t){o||(n&&Y(n.$$.fragment,t),o=!0)},o(t){n&&W(n.$$.fragment,t),o=!1},d(t){t&&p(r),n&&ot(n,t)}}}function vt(t){let e,n;return e=new yt({props:{error:t[0],status:t[1]}}),{c(){et(e.$$.fragment)},l(t){nt(e.$$.fragment,t)},m(t,r){rt(e,t,r),n=!0},p(t,n){const r={};1&n&&(r.error=t[0]),2&n&&(r.status=t[1]),e.$set(r)},i(t){n||(Y(e.$$.fragment,t),n=!0)},o(t){W(e.$$.fragment,t),n=!1},d(t){ot(e,t)}}}function bt(t){let e,n,r,o;const s=[vt,kt],i=[];function a(t,e){return t[0]?0:1}return e=a(t),n=i[e]=s[e](t),{c(){n.c(),r=k()},l(t){n.l(t),r=k()},m(t,n){i[e].m(t,n),d(t,r,n),o=!0},p(t,o){let c=e;e=a(t),e===c?i[e].p(t,o):(Z(),W(i[c],1,1,(()=>{i[c]=null})),K(),n=i[e],n?n.p(t,o):(n=i[e]=s[e](t),n.c()),Y(n,1),n.m(r.parentNode,r))},i(t){o||(Y(n),o=!0)},o(t){W(n),o=!1},d(t){i[e].d(t),t&&p(r)}}}function Bt(t){let n,r;const o=[{segment:t[2][0]},t[3].props];let s={$$slots:{default:[bt]},$$scope:{ctx:t}};for(let t=0;t<o.length;t+=1)s=e(s,o[t]);return n=new mt({props:s}),{c(){et(n.$$.fragment)},l(t){nt(n.$$.fragment,t)},m(t,e){rt(n,t,e),r=!0},p(t,[e]){const r=12&e?X(o,[4&e&&{segment:t[2][0]},8&e&&tt(t[3].props)]):{};147&e&&(r.$$scope={dirty:e,ctx:t}),n.$set(r)},i(t){r||(Y(n.$$.fragment,t),r=!0)},o(t){W(n.$$.fragment,t),r=!1},d(t){ot(n,t)}}}function Et(t,e,n){let{stores:r}=e,{error:o}=e,{status:s}=e,{segments:i}=e,{level0:a}=e,{level1:c=null}=e,{notify:l}=e;var f,u,h;return f=l,S().$$.after_update.push(f),u=ft,h=r,S().$$.context.set(u,h),t.$$set=t=>{"stores"in t&&n(5,r=t.stores),"error"in t&&n(0,o=t.error),"status"in t&&n(1,s=t.status),"segments"in t&&n(2,i=t.segments),"level0"in t&&n(3,a=t.level0),"level1"in t&&n(4,c=t.level1),"notify"in t&&n(6,l=t.notify)},[o,s,i,a,c,r,l]}class $t extends at{constructor(t){super(),it(this,t,Et,Bt,i,{stores:5,error:0,status:1,segments:2,level0:3,level1:4,notify:6})}}const Dt=[],wt=[{js:()=>Promise.all([import("./index.7afb12ea.js"),__inject_styles(["client-ec2f6238.css","Icon-06494acf.css","index-d8da364d.css"])]).then((function(t){return t[0]}))},{js:()=>Promise.all([import("./docs.f49c9a89.js"),__inject_styles(["client-ec2f6238.css","Icon-06494acf.css","docs-06494acf.css"])]).then((function(t){return t[0]}))}],xt=[{pattern:/^\/$/,parts:[{i:0}]},{pattern:/^\/docs\/?$/,parts:[{i:1}]}];
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function Lt(t,e,n,r){return new(n||(n=Promise))((function(o,s){function i(t){try{c(r.next(t))}catch(t){s(t)}}function a(t){try{c(r.throw(t))}catch(t){s(t)}}function c(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(i,a)}c((r=r.apply(t,e||[])).next())}))}function Ft(t){for(;t&&"A"!==t.nodeName.toUpperCase();)t=t.parentNode;return t}let _t,jt=1;const St="undefined"!=typeof history?history:{pushState:()=>{},replaceState:()=>{},scrollRestoration:"auto"},zt={};let Rt,Mt;function Nt(t){const e=Object.create(null);return t.length>0&&t.slice(1).split("&").forEach((t=>{const[,n,r=""]=/([^=]*)(?:=(.*))?/.exec(decodeURIComponent(t.replace(/\+/g," ")));"string"==typeof e[n]&&(e[n]=[e[n]]),"object"==typeof e[n]?e[n].push(r):e[n]=r})),e}function Pt(t){if(t.origin!==location.origin)return null;if(!t.pathname.startsWith(Rt))return null;let e=t.pathname.slice(Rt.length);if(""===e&&(e="/"),!Dt.some((t=>t.test(e))))for(let n=0;n<xt.length;n+=1){const r=xt[n],o=r.pattern.exec(e);if(o){const n=Nt(t.search),s=r.parts[r.parts.length-1],i=s.params?s.params(o):{},a={host:location.host,path:e,query:n,params:i};return{href:t.href,route:r,match:o,page:a}}}}function It(t){if(1!==function(t){return null===t.which?t.button:t.which}(t))return;if(t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return;if(t.defaultPrevented)return;const e=Ft(t.target);if(!e)return;if(!e.href)return;const n="object"==typeof e.href&&"SVGAnimatedString"===e.href.constructor.name,r=String(n?e.href.baseVal:e.href);if(r===location.href)return void(location.hash||t.preventDefault());if(e.hasAttribute("download")||"external"===e.getAttribute("rel"))return;if(n?e.target.baseVal:e.target)return;const o=new URL(r);if(o.pathname===location.pathname&&o.search===location.search)return;const s=Pt(o);if(s){qt(s,null,e.hasAttribute("sapper:noscroll"),o.hash),t.preventDefault(),St.pushState({id:_t},"",o.href)}}function Ot(){return{x:pageXOffset,y:pageYOffset}}function Tt(t){if(zt[_t]=Ot(),t.state){const e=Pt(new URL(location.href));e?qt(e,t.state.id):location.href=location.href}else jt=jt+1,function(t){_t=t}(jt),St.replaceState({id:_t},"",location.href)}function qt(t,e,n,r){return Lt(this,void 0,void 0,(function*(){const o=!!e;if(o)_t=e;else{const t=Ot();zt[_t]=t,_t=e=++jt,zt[_t]=n?t:{x:0,y:0}}if(yield Mt(t),document.activeElement&&document.activeElement instanceof HTMLElement&&document.activeElement.blur(),!n){let t,n=zt[e];r&&(t=document.getElementById(r.slice(1)),t&&(n={x:0,y:t.getBoundingClientRect().top+scrollY})),zt[_t]=n,o||t?scrollTo(n.x,n.y):scrollTo(0,0)}}))}function Ut(t){let e=t.baseURI;if(!e){const n=t.getElementsByTagName("base");e=n.length?n[0].href:t.URL}return e}let Ht,Gt=null;function Jt(t){const e=Ft(t.target);e&&"prefetch"===e.rel&&function(t){const e=Pt(new URL(t,Ut(document)));if(e)Gt&&t===Gt.href||(Gt={href:t,promise:le(e)}),Gt.promise}(e.href)}function Vt(t){clearTimeout(Ht),Ht=setTimeout((()=>{Jt(t)}),20)}function Zt(t,e={noscroll:!1,replaceState:!1}){const n=Pt(new URL(t,Ut(document)));return n?(St[e.replaceState?"replaceState":"pushState"]({id:_t},"",t),qt(n,null,e.noscroll)):(location.href=t,new Promise((()=>{})))}const Kt="undefined"!=typeof __SAPPER__&&__SAPPER__;let Yt,Wt,Qt,Xt=!1,te=[],ee="{}";const ne={page:function(t){const e=lt(t);let n=!0;return{notify:function(){n=!0,e.update((t=>t))},set:function(t){n=!1,e.set(t)},subscribe:function(t){let r;return e.subscribe((e=>{(void 0===r||n&&e!==r)&&t(r=e)}))}}}({}),preloading:lt(null),session:lt(Kt&&Kt.session)};let re,oe,se;function ie(t,e){const{error:n}=t;return Object.assign({error:n},e)}function ae(t){return Lt(this,void 0,void 0,(function*(){Yt&&ne.preloading.set(!0);const e=function(t){return Gt&&Gt.href===t.href?Gt.promise:le(t)}(t),n=Wt={},r=yield e,{redirect:o}=r;if(n===Wt)if(o)yield Zt(o.location,{replaceState:!0});else{const{props:e,branch:n}=r;yield ce(n,e,ie(e,t.page))}}))}function ce(t,e,n){return Lt(this,void 0,void 0,(function*(){ne.page.set(n),ne.preloading.set(!1),Yt?Yt.$set(e):(e.stores={page:{subscribe:ne.page.subscribe},preloading:{subscribe:ne.preloading.subscribe},session:ne.session},e.level0={props:yield Qt},e.notify=ne.page.notify,Yt=new $t({target:se,props:e,hydrate:!0})),te=t,ee=JSON.stringify(n.query),Xt=!0,oe=!1}))}function le(t){return Lt(this,void 0,void 0,(function*(){const{route:e,page:n}=t,r=n.path.split("/").filter(Boolean);let o=null;const s={error:null,status:200,segments:[r[0]]},i={fetch:(t,e)=>fetch(t,e),redirect:(t,e)=>{if(o&&(o.statusCode!==t||o.location!==e))throw new Error("Conflicting redirects");o={statusCode:t,location:e}},error:(t,e)=>{s.error="string"==typeof e?new Error(e):e,s.status=t}};if(!Qt){const t=()=>({});Qt=Kt.preloaded[0]||t.call(i,{host:n.host,path:n.path,query:n.query,params:{}},re)}let a,c=1;try{const o=JSON.stringify(n.query),l=e.pattern.exec(n.path);let f=!1;a=yield Promise.all(e.parts.map(((e,a)=>Lt(this,void 0,void 0,(function*(){const u=r[a];if(function(t,e,n,r){if(r!==ee)return!0;const o=te[t];return!!o&&(e!==o.segment||!(!o.match||JSON.stringify(o.match.slice(1,t+2))===JSON.stringify(n.slice(1,t+2)))||void 0)}(a,u,l,o)&&(f=!0),s.segments[c]=r[a+1],!e)return{segment:u};const h=c++;if(!oe&&!f&&te[a]&&te[a].part===e.i)return te[a];f=!1;const{default:d,preload:p}=yield wt[e.i].js();let m;return m=Xt||!Kt.preloaded[a+1]?p?yield p.call(i,{host:n.host,path:n.path,query:n.query,params:e.params?e.params(t.match):{}},re):{}:Kt.preloaded[a+1],s[`level${h}`]={component:d,props:m,segment:u,match:l,part:e.i}})))))}catch(t){s.error=t,s.status=500,a=[]}return{redirect:o,props:s,branch:a}}))}var fe,ue,he;ne.session.subscribe((t=>Lt(void 0,void 0,void 0,(function*(){if(re=t,!Xt)return;oe=!0;const e=Pt(new URL(location.href)),n=Wt={},{redirect:r,props:o,branch:s}=yield le(e);n===Wt&&(r?yield Zt(r.location,{replaceState:!0}):yield ce(s,o,ie(o,e.page)))})))),fe={target:document.querySelector("#sapper")},ue=fe.target,se=ue,he=Kt.baseUrl,Rt=he,Mt=ae,"scrollRestoration"in St&&(St.scrollRestoration="manual"),addEventListener("beforeunload",(()=>{St.scrollRestoration="auto"})),addEventListener("load",(()=>{St.scrollRestoration="manual"})),addEventListener("click",It),addEventListener("popstate",Tt),addEventListener("touchstart",Jt),addEventListener("mousemove",Vt),Kt.error?Promise.resolve().then((()=>function(){const{host:t,pathname:e,search:n}=location,{session:r,preloaded:o,status:s,error:i}=Kt;Qt||(Qt=o&&o[0]);const a={error:i,status:s,session:r,level0:{props:Qt},level1:{props:{status:s,error:i},component:yt},segments:o},c=Nt(n);ce([],a,{host:t,path:e,query:c,params:{},error:i})}())):Promise.resolve().then((()=>{const{hash:t,href:e}=location;St.replaceState({id:jt},"",e);const n=Pt(new URL(location.href));if(n)return qt(n,jt,!0,t)}));export{K as A,m as B,k as C,C as D,e as E,X as F,tt as G,a as H,l as I,L as J,o as K,Q as L,F as M,at as S,y as a,B as b,E as c,p as d,g as e,D as f,$ as g,b as h,it as i,d as j,h as k,w as l,t as m,f as n,et as o,nt as p,x as q,rt as r,i as s,A as t,v as u,Y as v,W as w,ot as x,z as y,Z as z};

import __inject_styles from './inject_styles.5607aec6.js';