var staticCacheName = 'restaurant-reviews';
var contentImgsCache = 'restaurant-image-cache';
var allCaches = [
  staticCacheName,
  contentImgsCache
];

var urlsToCache = [
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
];


// self.addEventListener('install', function(event) {
//   event.waitUntil(
//     caches.open(staticCacheName).then(function(cache) {
//       return cache.addAll([
//         // '/restaurant.html',
//         // '/img/1.jpg',
//         // '/img/2.jpg',
//         // '/img/3.jpg',
//         // '/img/4.jpg',
//         // '/img/5.jpg',
//       ]);
//     })
//   );
// });
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(contentImgsCache).then(function(cache) {
      return cache.addAll(urlsToCache)
    })
  );
});


// self.addEventListener('activate', function(event) {
//   event.waitUntil(
//     caches.keys().then(function(cacheNames) {
//       return Promise.all(
//         cacheNames.filter(function(cacheName) {
//           return cacheName.startsWith('restaurant-') &&
//                  !allCaches.includes(cacheName);
//         }).map(function(cacheName) {
//           return caches.delete(cacheName);
//         })
//       );
//     })
//   );
// });


// self.addEventListener('fetch', function(event) {
//   var requestUrl = new URL(event.request.url);

//   if (requestUrl.origin === location.origin) {
//     // if (requestUrl.pathname.startsWith('/restaurant.html')) {
//     //   event.respondWith(caches.match('/restaurant.html'));
//     //   return;
//     // }
//     if (requestUrl.pathname.startsWith('/img/')) {
//       return event.respondWith(servePhoto(event.request));
//     }
//   }

//   event.respondWith(
//     caches.match(event.request).then(function(response) {
//       return response || fetch(event.request);
//     })
//   );
// });

// function servePhoto(request) {
//   // Photo urls look like:
//   // /photos/9-8028-7527734776-e1d2bda28e-800px.jpg
//   // But storageUrl has the -800px.jpg bit missing.
//   // Use this url to store & match the image in the cache.
//   // This means you only store one copy of each photo.
//   // var storageUrl = request.url.replace(/-\d+px\.jpg$/, '');

//   // TODO: return images from the "wittr-content-imgs" cache
//   // if they're in there. Otherwise, fetch the images from
//   // the network, put them into the cache, and send it back
//   // to the browser.
//   //
//   // HINT: cache.put supports a plain url as the first parameter
//   caches.match(request.url).then(function(response) {
//     if (response) {
//       console.log("Found response in cache: ", response);
//       response.headers = {
//         'Content-Type': 'image/jpeg'
//       }
//       console.log(response);
//       return response;
//     }
//     fetch(request).then(function(response) {
//       console.log("taken from server: ", response);
//       return response
//     }).catch(function(error) {
//       console.error('fetching failed: ', error);
//       throw error;
//     })
//   })
// }

// self.addEventListener('message', function(event) {
//   if (event.data.action === 'skipWaiting') {
//     self.skipWaiting();
//   }
// });

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
