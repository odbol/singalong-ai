/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  const singleRequire = name => {
    if (name !== 'require') {
      name = name + '.js';
    }
    let promise = Promise.resolve();
    if (!registry[name]) {
      
        promise = new Promise(async resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = name;
            document.head.appendChild(script);
            script.onload = resolve;
          } else {
            importScripts(name);
            resolve();
          }
        });
      
    }
    return promise.then(() => {
      if (!registry[name]) {
        throw new Error(`Module ${name} didn’t register its module`);
      }
      return registry[name];
    });
  };

  const require = (names, resolve) => {
    Promise.all(names.map(singleRequire))
      .then(modules => resolve(modules.length === 1 ? modules[0] : modules));
  };
  
  const registry = {
    require: Promise.resolve(require)
  };

  self.define = (moduleName, depsNames, factory) => {
    if (registry[moduleName]) {
      // Module is already loading or loaded.
      return;
    }
    registry[moduleName] = Promise.resolve().then(() => {
      let exports = {};
      const module = {
        uri: location.origin + moduleName.slice(1)
      };
      return Promise.all(
        depsNames.map(depName => {
          switch(depName) {
            case "exports":
              return exports;
            case "module":
              return module;
            default:
              return singleRequire(depName);
          }
        })
      ).then(deps => {
        const facValue = factory(...deps);
        if(!exports.default) {
          exports.default = facValue;
        }
        return exports;
      });
    });
  };
}
define("./sw.js",['./workbox-decc7022'], function (workbox) { 'use strict';

  /**
  * Welcome to your Workbox-powered service worker!
  *
  * You'll need to register this file in your web app.
  * See https://goo.gl/nhQhGp
  *
  * The rest of the code is auto-generated. Please don't update this file
  * directly; instead, make changes to your Workbox build configuration
  * and re-run your build process.
  * See https://goo.gl/2aRDsh
  */

  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */

  workbox.precacheAndRoute([{
    "url": "index.html",
    "revision": "23efdbf2b6f9eeaac60671caed923238"
  }, {
    "url": "magenta.html",
    "revision": "0a225d58ab562021e52a25e87c0e276d"
  }, {
    "url": "magenta.js",
    "revision": "db478696984a288fa3f80f5095e97dbc"
  }, {
    "url": "ml/pitchDetection/group1-shard1of1",
    "revision": "e4329becd5f8db7de0298d46cd623d17"
  }, {
    "url": "ml/pitchDetection/group10-shard1of1",
    "revision": "9ddf4ed08bd8b439463e60d6b9372261"
  }, {
    "url": "ml/pitchDetection/group11-shard1of1",
    "revision": "cb05e1ddf1a9d8832d2adede820f56c4"
  }, {
    "url": "ml/pitchDetection/group12-shard1of1",
    "revision": "ac53f73fc8f4171d51c36cc25ef23190"
  }, {
    "url": "ml/pitchDetection/group13-shard1of1",
    "revision": "8c7cdcf5ada2ad2e1bc7e92b4fa1ef31"
  }, {
    "url": "ml/pitchDetection/group2-shard1of1",
    "revision": "988ad491376f1a40e89d2f99056cd950"
  }, {
    "url": "ml/pitchDetection/group3-shard1of1",
    "revision": "badbe16db64f00da5e643db306e8e543"
  }, {
    "url": "ml/pitchDetection/group4-shard1of1",
    "revision": "46c337b470264ab37258fce62466fd72"
  }, {
    "url": "ml/pitchDetection/group5-shard1of1",
    "revision": "170a81d5c30676fc924c69716e94b455"
  }, {
    "url": "ml/pitchDetection/group6-shard1of1",
    "revision": "fbdf9a7310bcc1a38822c4902ba54966"
  }, {
    "url": "ml/pitchDetection/group7-shard1of1",
    "revision": "7e7d84ad2ac13a3570e09bd7c93e3973"
  }, {
    "url": "ml/pitchDetection/group8-shard1of1",
    "revision": "a4e75fd5909cda3fe5e5368438d52044"
  }, {
    "url": "ml/pitchDetection/group9-shard1of1",
    "revision": "574167b73c6eec3d0338096463ec532d"
  }, {
    "url": "ml/pitchDetection/model.json",
    "revision": "31d247078d7619052ddba5aafe02b633"
  }], {});

});
//# sourceMappingURL=sw.js.map
