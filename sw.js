// Service worker mínimo: solo cachea el "cascarón" de la app para que
// abra aunque no haya señal, y para cumplir el requisito de PWA instalable.
// NO cachea llamadas a Supabase ni a otras APIs: esas siempre van a la red,
// así los datos que ves son siempre los más actuales.

const CACHE_NAME = "pionerotech-shell-v1";
const APP_SHELL = [
  "./pionerotech_app.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Solo intervenimos la navegación principal (abrir la app).
  // Todo lo demás (Supabase, fuentes, etc.) pasa directo a la red.
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request).catch(() => caches.match("./pionerotech_app.html"))
    );
  }
});
