const CACHE_NAME = "floraaura-shell-v25";
const APP_FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./floraaura.svg",
  "./icons/floraaura-192.png",
  "./icons/floraaura-512.png",
  "./icons/apple-touch-icon.png",
  "./assets/plants/monstera-user.png",
  "./assets/plants/lavender-user.png",
  "./assets/plants/aloe-vera-user.png",
  "./assets/plants/peace-lily-user.png",
  "./assets/plants/rose-user.png",
  "./assets/plants/orchid-user.png",
  "./assets/plants/red-rose-user.png",
  "./assets/plants/tulip-user.png",
  "./assets/plants/dahlia-user.png",
  "./assets/plants/daisy-user.png",
  "./assets/plants/cato.png",
  "./assets/plants/jiboia-user.png",
  "./assets/plants/petunia.png",
  "./assets/plants/hibisco.png",
  "./assets/plants/violeta-africana.png",
  "./assets/plants/gardenia.png",
  "./assets/plants/camelia.png",
  "./assets/plants/peonia-user.png",
  "./assets/plants/girassol.png",
  "./assets/plants/hortensia.png",
  "./assets/plants/hera.png",
  "./assets/plants/crisantemo.png",
  "./assets/plants/begonia.png",
  "./assets/plants/calateia.png",
  "./assets/plants/jasmim.png",
  "./assets/plants/geranio.png",
  "./assets/plants/alecrim.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith("floraaura-shell-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put("./index.html", copy));
          }
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match("./index.html");
          if (cachedPage) return cachedPage;
          return Response.error();
        })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        return Response.error();
      })
  );
});
