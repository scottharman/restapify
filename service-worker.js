!function(){"use strict";const e=1614096919775,t=`cache${e}`,n=["/client/client.d5c7da10.js","/client/inject_styles.5607aec6.js","/client/index.12ef8747.js","/client/Icon.68ce9a3a.js","/client/docs.569c1706.js"].concat(["/service-worker-index.html","/favicon-big.png","/favicon.png","/global.bundle.css","/global.css","/logo-192.png","/logo-512.png","/manifest.json"]),c=new Set(n);self.addEventListener("install",(e=>{e.waitUntil(caches.open(t).then((e=>e.addAll(n))).then((()=>{self.skipWaiting()})))})),self.addEventListener("activate",(e=>{e.waitUntil(caches.keys().then((async e=>{for(const n of e)n!==t&&await caches.delete(n);self.clients.claim()})))})),self.addEventListener("fetch",(t=>{if("GET"!==t.request.method||t.request.headers.has("range"))return;const n=new URL(t.request.url),s=n.protocol.startsWith("http"),a=n.hostname===self.location.hostname&&n.port!==self.location.port,o=n.host===self.location.host&&c.has(n.pathname),i="only-if-cached"===t.request.cache&&!o;!s||a||i||t.respondWith((async()=>o&&await caches.match(t.request)||async function(t){const n=await caches.open(`offline${e}`);try{const e=await fetch(t);return n.put(t,e.clone()),e}catch(e){const c=await n.match(t);if(c)return c;throw e}}(t.request))())}))}();
