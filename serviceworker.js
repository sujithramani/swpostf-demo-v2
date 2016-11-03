

var CACHE_VERSION = 1;
var CURRENT_CACHES = 'post-message-cache-v' + CACHE_VERSION;

var STATIC_CACHE_VERSION = 'static-v1';
var STATIC_CACHE_FILES = [
    'css/main.css',
    'js/jquery-1.10.2.js',
    'js/pouchdb-5.2.1.min.js',
    './index.html'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(STATIC_CACHE_VERSION)
            .then(function (cache) {
                console.log('Opened cache1');
                return cache.addAll(STATIC_CACHE_FILES);
            })
    );
});

 

// This is a somewhat contrived example of using client.postMessage() to originate a message from
// the service worker to each client (i.e. controlled page).
// Here, we send a message when the service worker starts up, prior to when it's ready to start
// handling events.
self.clients.matchAll().then(function(clients) {
  clients.forEach(function(client) {
    console.log(client);
    client.postMessage('The service worker just started up.');
  });
});

self.addEventListener('activate', function(event) {
  // Delete all caches that aren't named in CURRENT_CACHES.
  // While there is only one cache in this example, the same logic will handle the case where
  // there are multiple versioned caches.
 /* var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) { console.log(CURRENT_CACHES[key]);
    return CURRENT_CACHES[key]; 
  });*/
  var expectedCacheNames = [
  CURRENT_CACHES,
  STATIC_CACHE_VERSION
];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) { 
          if (expectedCacheNames.indexOf(cacheName) === -1) { 
            // If this cache name isn't present in the array of "expected" cache names, then delete it.
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return clients.claim();
    }).then(function() {
      // After the activation and claiming is complete, send a message to each of the controlled
      // pages letting it know that it's active.
      // This will trigger navigator.serviceWorker.onmessage in each client.
      return self.clients.matchAll().then(function(clients) {
        return Promise.all(clients.map(function(client) {
          return client.postMessage('The service worker has activated and ' +
            'taken control.');
        }));
      });
    })
  );
  
   event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(keys.map(function(key, i){
                if(key !== CACHE_VERSION){
                    return caches.delete(keys[i]);
                }
            }))
        })
    )
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have 2 stream.
            var responseToCache = response.clone();

            caches.open(STATIC_CACHE_VERSION)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

/*
self.addEventListener('fetch', function (event) { 
  var p1 = caches.open(STATIC_CACHE_VERSION).then(function(cache) {
  // event.respondWith( 
       caches.match(event.request).then(function(res){
         if(res){  console.log("k3"+JSON.stringify(event.request));
                return res;
            } 
           requestBackend(event);
        })
    //)
    });
});
   */
/*

function requestBackend(event){  

    return fetch(event.request).then(function(res){ console.log("k1"+JSON.stringify(event));
       //if not a valid response send the error
          if(!res || res.status !== 200 || res.type !== 'basic'){
            return res;
        }

        var response = res.clone();

        caches.open(STATIC_CACHE_VERSION).then(function(cache){
            cache.put(event.request, response);
        });    })

        return res;

}
*/

self.addEventListener('message', function(event) {
  console.log('Handling message event:', event);

   
    
   	
  var p = caches.open(CURRENT_CACHES).then(function(cache) {
    switch (event.data.command) {
      // This command returns a list of the URLs corresponding to the Request objects
      // that serve as keys for the current cache.
      case 'keys':
        return cache.keys().then(function(requests) {
          var urls = requests.map(function(request) {
            return request.url;
          });

          return urls.sort();
        }).then(function(urls) {
          // event.ports[0] corresponds to the MessagePort that was transferred as part of the controlled page's
          // call to controller.postMessage(). Therefore, event.ports[0].postMessage() will trigger the onmessage
          // handler from the controlled page.
          // It's up to you how to structure the messages that you send back; this is just one example.
          event.ports[0].postMessage({
            error: null,
            urls: urls
          });
        });

      // This command adds a new request/response pair to the cache.
      case 'add':
        // If event.data.url isn't a valid URL, new Request() will throw a TypeError which will be handled
        // by the outer .catch().
        // Hardcode {mode: 'no-cors} since the default for new Requests constructed from strings is to require
        // CORS, and we don't have any way of knowing whether an arbitrary URL that a user entered supports CORS.
        var request = new Request(event.data.url, { method: 'POST', body: event.data.getData, mode: 'no-cors'});
        var d=new Date();
        var t1=event.data.t1;
       console.log("t==>"+JSON.stringify(event.data));
        var newUrl = event.data.url+'?'+event.data.getData; 
       return fetch(request).then(function(res) { 
       	
       	if(navigator.onLine)
        {
        	 var msg='online';
        	}else {
        	console.log('offline');
        	 if(!res || res.status !== 200 || res.type !== 'basic'){ console.log('cache2');
       	     msg = 'offline';
       	if (t1 == '') {     
         var response = res.clone();      
         cache.put(event.data.url+'?t='+d.getTime(), response);
}
        // return res;  
        } 
        	
        	
        	}
       	 

       	 
        
        event.ports[0].postMessage({
            error: null,
            msg: msg,
            d: d.getTime()
          });

         // return cache.put(newUrl, response);
        }).catch(function() {  console.log('error==>'); 
        	
       
          	
        	
        var init = {
    status: 200,
    statusText: "OK",
    headers: {'Content-Type': 'text/plain'}
};

var res = new Response("Hello World!", init);
         var msg = 'offline';
       	if (t1 == '') {     
         var response = res.clone();      
          	if(navigator.onLine) {
          }else {
         cache.put(event.data.url+'?t='+d.getTime(), response);
         }
         
}

        event.ports[0].postMessage({
            error: null,
            msg: msg,
            d: d.getTime()
          });
          
          
        	
        	 });
      /*  caches.match(event.data.url)
      .then(function(response) {
      
        // Cache hit - return the response from the cached version
        if (response) { console.log('cache1');
          return response;
        }

        // Not in cache - return the result from the live server
        // `fetch` is essentially a "fallback"
     //  return fetch(request);
         
         var url = request;
   return fetch(url).then(function(res){ 
        //if not a valid response send the error
        if(!res || res.status !== 200 || res.type !== 'basic'){ console.log('cache2');
         var response = res.clone();      
         cache.put(event.data.url+'?t='+d.getTime(), response);
         
        
        // return res;  
        }
console.log('cache35');


   
        //return res;
    }).then(function() {
          event.ports[0].postMessage({
            error: null
          });
        });
       }
    );*/
  

      // This command removes a request/response pair from the cache (assuming it exists).
      case 'delete':
        return cache.delete(event.data.url).then(function(success) {
          event.ports[0].postMessage({
            error: success ? null : 'Item was not found in the cache.'
          });
        });

      default:
        // This will be handled by the outer .catch().
        throw Error('Unknown command: ' + event.data.command);
    }
  }).catch(function(error) {
    // If the promise rejects, handle it by returning a standardized error message to the controlled page.
    console.error('Message handling failed:', error);

    event.ports[0].postMessage({
      error: error.toString()
    });
  });

  // Beginning in Chrome 51, event is an ExtendableMessageEvent, which supports
  // the waitUntil() method for extending the lifetime of the event handler
  // until the promise is resolved.
  if ('waitUntil' in event) {
    event.waitUntil(p);
  }

  // Without support for waitUntil(), there's a chance that if the promise chain
  // takes "too long" to execute, the service worker might be automatically
  // stopped before it's complete.
});

