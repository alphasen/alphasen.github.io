/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "3dad2a1f01eb6d4faf81738a1ef514ed"
  },
  {
    "url": "assets/css/0.styles.7f06094c.css",
    "revision": "fb343f16f5c94f24777abcc9221b37b5"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.7be5d1ae.js",
    "revision": "45c990ad3c80013681002fa83b28e30b"
  },
  {
    "url": "assets/js/11.2f28fa00.js",
    "revision": "443ce2561697cea7abffa4fd47b3e7d9"
  },
  {
    "url": "assets/js/12.7222b1f1.js",
    "revision": "1095fd7744ff78bea4a61c5b3af61c67"
  },
  {
    "url": "assets/js/13.e4a3df77.js",
    "revision": "c593f1af2071a04a42a20b0a2d54cd97"
  },
  {
    "url": "assets/js/14.b056a73a.js",
    "revision": "7398b23628179127746b081d39d4c518"
  },
  {
    "url": "assets/js/15.49856cb4.js",
    "revision": "273c837fed61758422a6160660877d70"
  },
  {
    "url": "assets/js/16.f4425947.js",
    "revision": "41f9d47515379f229801df2a404d95ea"
  },
  {
    "url": "assets/js/17.33e280fa.js",
    "revision": "b4dfe5873ac095169f3247d80e49ec12"
  },
  {
    "url": "assets/js/18.3a61f332.js",
    "revision": "0e5e92bdec4fc5b171d06d575298f8a2"
  },
  {
    "url": "assets/js/19.00f8b91c.js",
    "revision": "798b96016df58cd5087b5a4e5b097f43"
  },
  {
    "url": "assets/js/2.58eaf8be.js",
    "revision": "27b840bb9ffc6a409f0c7b1afbf9e7b2"
  },
  {
    "url": "assets/js/20.e8beb5b5.js",
    "revision": "500b6d6c3095ba3b27fef816b24372fa"
  },
  {
    "url": "assets/js/21.2166c3ea.js",
    "revision": "612a511a83022ba821b91b50c2b584a2"
  },
  {
    "url": "assets/js/22.0b419ae3.js",
    "revision": "2d616f72bbab63c5d6fb8ffc94a41b74"
  },
  {
    "url": "assets/js/23.776cd046.js",
    "revision": "1462f1a7ec67106094b1ab65b126d1ec"
  },
  {
    "url": "assets/js/24.4756b9c2.js",
    "revision": "70955cecde8e271637dd50256235d824"
  },
  {
    "url": "assets/js/25.5ea267cb.js",
    "revision": "05e27def6b671b80ce8f1fa4a8ff280a"
  },
  {
    "url": "assets/js/26.61782855.js",
    "revision": "dbc7270b61fceeab2b392d18f84ffa46"
  },
  {
    "url": "assets/js/27.670be8ef.js",
    "revision": "6538adf4bb415f32b800a7b6e0856e68"
  },
  {
    "url": "assets/js/28.b506e69e.js",
    "revision": "09726c9b070f875dcb71b6e56f348f36"
  },
  {
    "url": "assets/js/3.f2a5cb00.js",
    "revision": "b5d9c16e0cf7d3b236d002e9ca68bc20"
  },
  {
    "url": "assets/js/4.b408d12e.js",
    "revision": "b7593fce22e5954a5f5c835c525cf685"
  },
  {
    "url": "assets/js/5.40b2e56c.js",
    "revision": "ec13e0986d2431d2dbfd5dbd62910f8b"
  },
  {
    "url": "assets/js/6.ffab53b5.js",
    "revision": "2edb55716abe93e357aa665c1bf56650"
  },
  {
    "url": "assets/js/7.8f488cb5.js",
    "revision": "402f988d1c51c4189d229b920b6e1095"
  },
  {
    "url": "assets/js/8.dac88724.js",
    "revision": "e031fa83e6589aeaf478e435e52b2078"
  },
  {
    "url": "assets/js/9.c72da658.js",
    "revision": "aa066b8307c12bc306c4550d8c965ccc"
  },
  {
    "url": "assets/js/app.87d94ce0.js",
    "revision": "0cfa76b7536ccf06e701d953ae545e5c"
  },
  {
    "url": "index.html",
    "revision": "8cd2530c6139e722bf2f1a54f07ab402"
  },
  {
    "url": "logo.png",
    "revision": "b79772147c91d019f3f9a6a00a8520ec"
  },
  {
    "url": "logo2.png",
    "revision": "2563d2139959335ac72df1c9d0c80527"
  },
  {
    "url": "logo3.png",
    "revision": "1aa4478ddb422bf0cdda7b0a26b7baba"
  },
  {
    "url": "nav.1.javascript/index.html",
    "revision": "b03541270792ed3ac564d258a2ffe451"
  },
  {
    "url": "nav.1.javascript/promise.html",
    "revision": "a37d166e56fb02caf74afc72ad0a9ca7"
  },
  {
    "url": "nav.1.javascript/作用域链.html",
    "revision": "8fa23d8d8a2d6322fdc753838df1ebc2"
  },
  {
    "url": "nav.1.javascript/你不知道的JavaScript.html",
    "revision": "40de1cf2407739e34a0ee474f3f1fd34"
  },
  {
    "url": "nav.1.javascript/你不知道的JavaScript上.html",
    "revision": "1aba5038f3a8086de0deeafdd8cfbc05"
  },
  {
    "url": "nav.1.javascript/你不知道的JavaScript中.html",
    "revision": "d6d42969539bdec76bcf5ce542d0d261"
  },
  {
    "url": "nav.1.javascript/原型链.html",
    "revision": "31441e1a2749c6b6711b7f06b0034364"
  },
  {
    "url": "nav.1.javascript/变脸对象.html",
    "revision": "3fe400d961776c9dc650afc517d9d0c8"
  },
  {
    "url": "nav.1.javascript/执行上下文.html",
    "revision": "8d740b455392cd94abffe31f679ae9ac"
  },
  {
    "url": "nav.1.javascript/词法作用域.html",
    "revision": "8b7aefad9098e4c7758f03fa378e27b0"
  },
  {
    "url": "nav.2.algorithm/index.html",
    "revision": "b015d7e07dc77c4eaeb0ea959559e675"
  },
  {
    "url": "nav.3.react/index.html",
    "revision": "a14682a77ccefd6aa6f77d97ab4eb75f"
  },
  {
    "url": "nav.4.vue/index.html",
    "revision": "70f50a3f715457426a9d2f3522ad3c05"
  },
  {
    "url": "nav.5.typescript/index.html",
    "revision": "43f5b095470ac04b5bf497a36a128f06"
  },
  {
    "url": "nav.6.webpack/index.html",
    "revision": "0e111632569b3f42b8098bd0ae07a1d9"
  },
  {
    "url": "nav.6.webpack/笔记.html",
    "revision": "d82da55f8e8872fc55095d3c09e7c481"
  },
  {
    "url": "nav.7.other/github-pages.html",
    "revision": "f322db7f842f0d28c9a53103a5ae8c28"
  },
  {
    "url": "nav.7.other/index.html",
    "revision": "e519883e3756a04b737b2a54c67ef146"
  },
  {
    "url": "nav.7.other/深度好文.html",
    "revision": "28ba610035a161192dd943b8227376ab"
  },
  {
    "url": "prototype.png",
    "revision": "1b1aef8208812184417d2063a6773272"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
