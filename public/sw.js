// Tombstone service worker.
//
// The site previously shipped a Serwist-based service worker. That feature has
// been removed. This minimal worker exists only so that browsers which still
// have the old worker registered will replace it, unregister themselves, and
// drop any caches it left behind. It can be deleted once enough time has passed
// for returning visitors to have updated.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      } catch {
        // Ignore cache cleanup failures.
      }

      await self.registration.unregister();

      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })(),
  );
});
