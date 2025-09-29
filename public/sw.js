self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');

  const CACHE_NAME = 'task-app-cache-v1';
  const urisToCache = [
    '/',
    '/index.html',
    '/vite.svg',
    '/manifest.json'
  ];

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urisToCache);
      })
    )



  // Perform install steps
  self.skipWaiting(); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');

  const CACHE_NAME = 'task-app-cache-v1';

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Become available to all pages

 
});

self.addEventListener('fetch', (event) => {
  // Só intercepta requisições GET
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);
  
  // FILTRO COMPLETO de URLs não suportadas
  const unsupportedProtocols = ['chrome-extension:', 'data:', 'blob:', 'file:'];
  if (unsupportedProtocols.includes(url.protocol) || !url.protocol.startsWith('http')) {
    return; // Não processa essas requisições
  }

  // Só cacheia requisições da mesma origem (opcional)
  // if (url.origin !== location.origin) {
  //   return;
  // }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Se tem no cache, retorna
      if (cachedResponse) {
        return cachedResponse;
      }

      // Se não tem no cache, faz fetch
      return fetch(event.request).then(networkResponse => {
        // Só cacheia se for uma resposta válida
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Verifica se é um arquivo que deve ser cacheado
        const isCacheable = /\.(js|css|png|jpg|jpeg|svg|webp|json|ico)$/.test(url.pathname);
        
        if (isCacheable) {
          // Clona a resposta para o cache
          const responseToCache = networkResponse.clone();
          caches.open('task-app-cache-v1')
            .then(cache => cache.put(event.request, responseToCache))
            .catch(err => console.log('Cache put error:', err));
        }

        return networkResponse;
      });
    }).catch(() => {
      // Fallback para páginas
      if (event.request.mode === 'navigate') {
        return caches.match('/');
      }
      return new Response('Offline');
    })
  );
});


self.addEventListener('online', () => {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({type: 'online'});
    })
  })
})

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tasks') {
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({type: 'online'});
      })
    })  
  }
})