/*if ('serviceWorker' in navigator) {
   console.log("SW present !!! ");
   navigator.serviceWorker.register('./serviceworker.js',{ insecure: true }).then(function(registration){
      console.log('Service worker registered : ', registration.scope);
    })
.catch(function(err) {
    // registration failed :(
     console.log('ServiceWorker registration failed: ', err);
  });
}	
  


if('serviceWorker' in navigator){
    // Handler for messages coming from the service worker
    navigator.serviceWorker.addEventListener('message', function(event){
        console.log("Client 1 Received Message: " + event.data);
        event.ports[0].postMessage("Client 1 Says 'Hello back!'");
    });
}

*/
