const CACHE_NAME = "floraaura-shell-v3";
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
  "./assets/plants/monstera.jpg",
  "./assets/plants/lavender.jpg",
  "./assets/plants/aloe-vera.jpg",
  "./assets/plants/peace-lily.jpg",
  "./assets/plants/rose.jpg",
  "./assets/plants/orchid.jpg",
  "./assets/plants/red-rose.jpg",
  "./assets/plants/tulip.jpg",
  "./assets/plants/dahlia.jpg",
  "./assets/plants/daisy.jpg"
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
