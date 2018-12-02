var staticCacheName = 'restaurant-reviews';
var contentImgsCache = 'restaurant-image-cache';
var allCaches = [
  staticCacheName,
  contentImgsCache
];

var urlsToCache = [
  '/img/',
];


self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(contentImgsCache).then(function(cache) {
      return cache.addAll(urlsToCache)
    })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response;
      }
      let fetchRequest = event.request.clone();
      return fetch(fetchRequest).then(
        function(response) {
          if (!response || response.status != 200 || response.type != 'basic') {
            return response;
          }
          let responseToCache = response.clone();
          caches.open(contentImgsCache).then(function(cache) {
            cache.put(event.request, responseToCache);
          })
          return response;
        }
      )
    })
  )
})
