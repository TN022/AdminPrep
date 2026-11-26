const CACHE = "adminprep-pwa-v1";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith("adminprep-pwa-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
 const r = e.request; if(r.method !== "GET" || !r.url.startsWith(self.registration.scope)) return;
 if(r.mode === "navigate") { e.respondWith(fetch(r).then(response => { if(response.ok) { const copy=response.clone(); e.waitUntil(caches.open(CACHE).then(c=>c.put("./index.html",copy))); } return response; }).catch(()=>caches.match("./index.html"))); return; }
 e.respondWith(caches.match(r).then(hit => hit || fetch(r)));
});
