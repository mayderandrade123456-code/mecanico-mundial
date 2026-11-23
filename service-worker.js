
const CACHE_NAME = "mecanico-mundial-v1";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ARQUIVOS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(chaves => {
      return Promise.all(
        chaves
          .filter(chave => chave !== CACHE_NAME)
          .map(chave => caches.delete(chave))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(resposta => {
        if (resposta.ok && new URL(event.request.url).origin === self.location.origin) {
          const copia = resposta.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copia);
          });
        }
        return resposta;
      })
      .catch(() => caches.match(event.request))
  );
});
