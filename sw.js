let staticCacheName = 'restaurant-reviews';
let contentImgsCache = 'restaurant-image-cache';
let allCaches = [
  staticCacheName,
  contentImgsCache
];

let imageURLsToCache = [
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
]

let staticURLsToCache = [
  '/js/main.js',
  '/js/dbhelper.js',
  '/js/restaurant_info.js',
  '/data/restaurants.json',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'restaurant.html',
  'index.html',
] 


self.addEventListener('install', function(event) {
  event.waitUntil(openCaches());
});


function openCaches() {
  caches.open(contentImgsCache).then(function(cache) {
    return cache.addAll(imageURLsToCache);
  });
  caches.open(staticCacheName).then(function(cache) {
    return cache.addAll(staticURLsToCache);
  })
}


self.addEventListener('fetch', function(event) {
  let requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.startsWith('/img/')) {
    return serve(event, contentImgsCache)
  } else {
    return serve(event, staticCacheName)
  }
})


function serve(event, cacheName) {
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
          caches.open(cacheName).then(function(cache) {
            cache.put(event.request, responseToCache);
          })
          return response;
        }
      )
    })
  )
}
