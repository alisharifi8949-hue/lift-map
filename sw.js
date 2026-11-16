const V="liftmap-v1",LEAF="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png",LEAF];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!=="tiles").map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(u.hostname.endsWith("tile.openstreetmap.org")){
    e.respondWith(caches.open("tiles").then(async c=>{const m=await c.match(r);if(m)return m;try{const n=await fetch(r);c.put(r,n.clone());return n}catch(x){return Response.error()}}));return}
  if(r.mode==="navigate"){
    e.respondWith(fetch(r).then(n=>{const k=n.clone();caches.open(V).then(c=>c.put("index.html",k));return n}).catch(()=>caches.match("index.html")));return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(n=>{if(n.ok||n.type==="opaque"){const k=n.clone();caches.open(V).then(c=>c.put(r,k))}return n}).catch(()=>m)));
});

