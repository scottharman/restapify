!function(){"use strict";const e=1614161606786,t=`cache${e}`,n=["/client/client.0a787015.js","/client/inject_styles.5607aec6.js","/client/index.7afb12ea.js","/client/Icon.19990d77.js","/client/docs.f49c9a89.js"].concat(["/service-worker-index.html","/favicon-big.png","/favicon.png","/global.bundle.css","/global.css","/logo-192.png","/logo-512.png","/manifest.json"]),s=new Set(n);self.addEventListener("install",(e=>{e.waitUntil(caches.open(t).then((e=>e.addAll(n))).then((()=>{self.skipWaiting()})))})),self.addEventListener("activate",(e=>{e.waitUntil(caches.keys().then((async e=>{for(const n of e)n!==t&&await caches.delete(n);self.clients.claim()})))})),self.addEventListener("fetch",(t=>{if("GET"!==t.request.method||t.request.headers.has("range"))return;const n=new URL(t.request.url),c=n.protocol.startsWith("http"),a=n.hostname===self.location.hostname&&n.port!==self.location.port,o=n.host===self.location.host&&s.has(n.pathname),i="only-if-cached"===t.request.cache&&!o;!c||a||i||t.respondWith((async()=>o&&await caches.match(t.request)||async function(t){const n=await caches.open(`offline${e}`);try{const e=await fetch(t);return n.put(t,e.clone()),e}catch(e){const s=await n.match(t);if(s)return s;throw e}}(t.request))())}))}();
