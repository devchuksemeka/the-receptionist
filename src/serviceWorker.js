const staticOATApp = "oat-releaf"
const assets = [
    "/",
    "/index.html",
    "/static/0.chunk.js",
    "/static/bundle.js",
    "/static/main.chunk.js",
  ]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
      caches.open(staticOATApp).then(cache => {
        cache.addAll(assets)
      })
    )
  })