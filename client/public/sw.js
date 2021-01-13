/* eslint-disable no-restricted-globals */

const STATIC_CACHE = "static-v2";
// const DYNAMIC_CACHE = "dynamic-v1";

const STATIC_FILES = [
  "./",
  "./index.html",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "./offline.html",
  "./favicon.ico",
];

self.addEventListener("install", (event) => {
  console.log("[Service Worker] installing...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[Service worker] Pre caching App shell");
        cache.addAll(STATIC_FILES);
      })
      .catch((error) => {
        console.log(error.message);
      })
  );
});

self.addEventListener("activate", () => {
  console.log("[Service Worker] activating...");
  caches.keys().then((keys) => {
    return Promise.all(
      // eslint-disable-next-line array-callback-return
      keys.map((key) => {
        if (key !== STATIC_CACHE) {
          return caches.delete(key);
        }
      })
    );
  });
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response;
        } else {
          return fetch(event.request);
        }
      })
      .catch(() => {
        if (event.request.headers.get("accept").includes("text/html")) {
          return caches.match("/offline.html");
        }
      })
  );
});

self.addEventListener("push", (event) => {
  console.log("Notification received");
  let data = {
    title: "New!",
    content: "Something new happened",
    openUrl: "/",
  };
  if (event.data) {
    data = JSON.parse(event.data.text());
  }
  const options = {
    body: data.content,
    dir: "ltr",
    lang: "en-US",
    vibrate: [200, 50, 200],
    data: {
      url: data.openUrl,
    },
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
