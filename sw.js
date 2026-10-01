// Guarda o app no aparelho para abrir sem internet.
// Gerado por gerar-pwa.ps1 - versão 20261001-014637
const CACHE='simulador-poker-20261001-014637';
const FILES=[
  './',
  './index.html',
  './manifest.webmanifest',
  './fonts.css',
  './fonts/cinzel-latin-2.woff2',
  './fonts/cinzel-latin-ext-1.woff2',
  './fonts/jost-latin-4.woff2',
  './fonts/jost-latin-ext-3.woff2',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys()
    .then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
    .then(()=>self.clients.claim()));
});
// Abre na hora com o que está guardado e busca a versão nova em segundo plano para a próxima abertura
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET'||new URL(req.url).origin!==location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(req,{ignoreSearch:true});
    const net=fetch(req).then(r=>{if(r&&r.ok)c.put(req,r.clone());return r;}).catch(()=>null);
    if(hit){e.waitUntil(net);return hit;}
    const r=await net;
    return r||c.match('./index.html');
  }));
});