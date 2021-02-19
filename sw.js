//this will install when the browser is OPEN
self.addEventListener("install", (evt) => {
  console.log("Server worker installed");
});

//active service woker
self.addEventListener("activate", (evt) => {
  console.log("Service worker has been activated");
});

//fetch event (mandatory)
self.addEventListener("fetch", (evt) => {
  //   console.log("fetch event", evt);
});
