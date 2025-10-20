self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("slt-cache").then(cache => {
      const scopeUrl = self.registration && self.registration.scope ? self.registration.scope : self.location.href;
      const baseUrl = new URL("./", scopeUrl);
      const assets = [
        baseUrl.toString(),
        new URL("index.html", baseUrl).toString(),
        new URL("manifest.json", baseUrl).toString()
      ];
      return cache.addAll(assets);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
