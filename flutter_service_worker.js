'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"version.json": "44d6b13179515976a279fd6c6add89c1",
"index.html": "2d7e495454816ea2838f63fb18dd192e",
"/": "2d7e495454816ea2838f63fb18dd192e",
"main.dart.js": "3613e524ef7285aa57ad004ce80661e4",
"flutter.js": "7d69e653079438abfbb24b82a655b0a4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "153b04ba156cc2d766b097e5c1ad53d9",
"assets/AssetManifest.json": "230d0f0ff0515983d7c00ea1fadfa14c",
"assets/NOTICES": "890a5386088e5521490a5bbc43cc465b",
"assets/FontManifest.json": "21bb07297595ca6a4224f655be1d534e",
"assets/AssetManifest.bin.json": "e30cfa05229bb4c891f29c13f0d0ccfd",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "89ed8f4e49bcdfc0b5bfc9b24591e347",
"assets/shaders/ink_sparkle.frag": "4096b5150bac93c41cbc9b45276bd90f",
"assets/AssetManifest.bin": "1bd84b432ab08138e2a1a81a5be57c24",
"assets/fonts/MaterialIcons-Regular.otf": "632782eaa6d872b3136ff824e3bb213b",
"assets/assets/images/2.0x/splash.png": "2132e5d799fba67049c39dd1c5a43be2",
"assets/assets/images/3.0x/splash.png": "bf68eccca4d3ab3ab19098abf5f7db1e",
"assets/assets/images/splash.png": "7d225263a5a9d056d3c8674d5b1e1f1a",
"assets/assets/backgrounds/2.0x/background.png": "5dfc47b2dd86b7bb8a2d0c0513fe8a5e",
"assets/assets/backgrounds/3.0x/background.png": "ce3a920bbd203a42ff5ecd373785665a",
"assets/assets/backgrounds/background.png": "fb3aafc3e95dbf5004b5e944f92499b4",
"assets/assets/icons/menu/fonts/MenuIcons.ttf": "ce426776faad5191e358f2ff7765999f",
"assets/assets/devices/load_sensor.png": "d81d6a378ea57f0ab77650f0ca5554c8",
"assets/assets/devices/controller.png": "0a4e3e4403cb75b971b17c00509dabc2",
"assets/assets/devices/hoist.png": "a4edd2899cb76029773b68d853dd1909",
"assets/assets/devices/2.0x/load_sensor.png": "2e78019b1a48d427dbbd5a7f646d938e",
"assets/assets/devices/2.0x/controller.png": "f75f4b3448fb2354656b34d66506152b",
"assets/assets/devices/2.0x/hoist.png": "d4dd6df0d3c316d3cddfa8b01ba97619",
"assets/assets/devices/2.0x/remote.png": "220b10064d523904265b89a5b8a6298c",
"assets/assets/devices/2.0x/hoists_edit.png": "6151280acfac32b2f465ea676dc76f04",
"assets/assets/devices/remote.png": "6a5c1954ee536d4271fac3b9a4723029",
"assets/assets/devices/3.0x/load_sensor.png": "7b96c82b5645ad2de7b1a7f590153187",
"assets/assets/devices/3.0x/controller.png": "30e9173d8871bf3f4abc7101b1617e3f",
"assets/assets/devices/3.0x/hoist.png": "32fdfab644993932c63e386b98fc3c09",
"assets/assets/devices/3.0x/remote.png": "01cf6a547a56dbdc2f569f6416b8a428",
"assets/assets/devices/3.0x/hoists_edit.png": "ee55fc2dd73b9878e8b062c9d5ca8639",
"assets/assets/devices/hoists_edit.png": "15ef321c397726cf29838587b08694a4",
"canvaskit/skwasm.js": "87063acf45c5e1ab9565dcf06b0c18b8",
"canvaskit/skwasm.wasm": "2fc47c0a0c3c7af8542b601634fe9674",
"canvaskit/chromium/canvaskit.js": "0ae8bbcc58155679458a0f7a00f66873",
"canvaskit/chromium/canvaskit.wasm": "143af6ff368f9cd21c863bfa4274c406",
"canvaskit/canvaskit.js": "eb8797020acdbdf96a12fb0405582c1b",
"canvaskit/canvaskit.wasm": "73584c1a3367e3eaf757647a8f5c5989",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
