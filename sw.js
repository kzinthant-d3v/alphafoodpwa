const staticCacheName = "site-static-v7";
const dynamicCacheName = "site-dynamic-v8";

const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://fonts.gstatic.com/s/materialicons/v77/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
  "/pages/fallback.html",
]; //'/' is key to the cache

//cache limit function
const limitCacheSize = (name, size) => {
  // console.log("function called");
  // console.log(`limited ${name}= ${size}`);
  caches.open(name).then((cache) => {
    // console.log("cache opened");
    // console.log(cache);
    cache.keys().then((keys) => {
      // console.log(keys);
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

//this will install when the browser is OPEN
//cache here
self.addEventListener("install", (evt) => {
  // console.log("Server worker installed");
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      // cache.add
      // console.log("caching shell assets");
      cache.addAll(assets);
      console.log("assets added");
    })
  );
});

//active service woker
self.addEventListener("activate", (evt) => {
  // console.log("Service worker has been activated");
  evt.waitUntil(
    caches.keys().then((keys) => {
      //console.log(keys);
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

//fetch event (mandatory)
self.addEventListener("fetch", (evt) => {
  //   console.log("fetch event", evt);
  if (evt.request.url.indexOf("firestore.googleapis.com") === -1) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then((cacheRes) => {
          return (
            cacheRes ||
            fetch(evt.request).then((fetchRes) => {
              return caches.open(dynamicCacheName).then((cache) => {
                cache.put(evt.request.url, fetchRes.clone());
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
        })
        //add fallbackpage html
        .catch(() => {
          if (evt.request.url.indexOf(".html") > -1) {
            return caches.match("/pages/fallback.html");
          }
        })
    );
  }
});
