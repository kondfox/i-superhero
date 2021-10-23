// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/arc-text/dist/arc-text.es5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var splitNode = function (node, splitter) {
  var wrapperElement = document.createElement('span');
  var text = node.innerText.trim();
  var chars = splitter ? splitter(text) : text.split('').slice();
  return chars.map(function (char) {
    var parent = wrapperElement.cloneNode();
    parent.insertAdjacentHTML('afterbegin', char === ' ' ? '&nbsp;' : char);
    return parent;
  });
};

var getRect = function (element) {
  var rect = element.getBoundingClientRect();
  return {
    height: rect.height,
    left: rect.left + window.pageXOffset,
    top: rect.top + window.pageYOffset,
    width: rect.width
  };
};

var radiansPerDegree = Math.PI / 180;
var degreesPerRadian = 180 / Math.PI;

var chord = function (r, θ) {
  return 2 * r * Math.sin(degreesToRadians(θ / 2));
};

var radiansToDegrees = function (angleInDegrees) {
  return angleInDegrees * degreesPerRadian;
};

var degreesToRadians = function (angleInDegrees) {
  return angleInDegrees * radiansPerDegree;
};

var sagitta = function (r, θ) {
  return r * (1 - Math.cos(degreesToRadians(θ / 2)));
};

var getLetterRotations = function (metrics, r) {
  return metrics.reduce(function (data, _a) {
    var width = _a.width;
    var rotation = radiansToDegrees(width / r);
    return {
      θ: data.θ + rotation,
      rotations: data.rotations.concat([data.θ + rotation / 2])
    };
  }, {
    θ: 0,
    rotations: []
  });
};

var PI = Math.PI,
    max = Math.max,
    min = Math.min;

var ArcText = function () {
  function ArcText(elm, splitter) {
    if (splitter === void 0) {
      splitter = undefined;
    }

    this.element = elm;
    this.originalHTML = this.element.innerHTML;
    var container = document.createElement('div');
    var fragment = document.createDocumentFragment();
    container.setAttribute('aria-label', this.element.innerText);
    container.style.position = 'relative';
    this.container = container;
    this.letters = splitNode(this.element, splitter);
    this.letters.forEach(function (letter) {
      return fragment.appendChild(letter);
    });
    container.appendChild(fragment);
    this.element.innerHTML = '';
    this.element.appendChild(container);

    var _a = window.getComputedStyle(this.element),
        fontSize = _a.fontSize,
        lineHeight = _a.lineHeight;

    this.fontSize = parseFloat(fontSize);
    this.lineHeight = parseFloat(lineHeight) || this.fontSize;
    this.metrics = this.letters.map(getRect);
    var totalWidth = this.metrics.reduce(function (sum, _a) {
      var width = _a.width;
      return sum + width;
    }, 0);
    this.minRadius = totalWidth / PI / 2 + this.lineHeight;
    this.dir = 1;
    this.isForceWidth = false;
    this.isForceHeight = true;
    this.radius = this.minRadius;
    this.invalidate();
  }

  ArcText.prototype.forceWidth = function (value) {
    if (value) {
      this.isForceWidth = value;
      this.invalidate();
      return this;
    }

    return this.isForceWidth;
  };

  ArcText.prototype.forceHeight = function (value) {
    if (value) {
      this.isForceHeight = value;
      this.invalidate();
      return this;
    }

    return this.isForceHeight;
  };
  /**
   * Sets the text direction. `1` is clockwise, `-1` is counter-clockwise.
   *
   * @name dir
   * @function
   * @instance
   * @memberof ArcText
   * @param  {number} value A new text direction.
   * @return {ArcText}   The current instance.
   *
   * @example
   * const arcText = new ArcText(document.getElementById('myElement'));
   *
   * // Set the direction to counter-clockwise.
   * arcText.dir(-1);
   *
   * // Set the direction to clockwise.
   * arcText.dir(1);
   */


  ArcText.prototype.direction = function (value) {
    if (value) {
      this.dir = value;
      this.invalidate();
      return this;
    }

    return this.dir;
  };
  /**
   * Gets the text radius in pixels. The default radius is the radius required
   * for the text to form a complete circle.
   *
   * @name radius
   * @function
   * @instance
   * @memberof ArcText
   * @return {number} The current text radius.
   *
   * @example
   * const arcText = new ArcText(document.getElementById('myElement'));
   *
   * arcText.radius();
   * //=> 150
   */


  ArcText.prototype.arc = function (value) {
    if (value) {
      this.radius = max(this.minRadius, value);
      this.invalidate();
      return this;
    }

    return this.radius;
  };
  /**
   * Removes the ArcText effect from the element, restoring it to its
   * original state.
   *
   * @return {ArcText} This instance.
   *
   * @example
   * const arcText = new ArcText(document.getElementById('myElement'));
   *
   * // Restore `myElement` to its original state.
   * arcText.destroy();
   */


  ArcText.prototype.destroy = function () {
    this.element.innerHTML = this.originalHTML;
    return this;
  };
  /**
   * Removes the ArcText effect from the element, restoring it to its
   * original state.
   *
   * @return {ArcText} This instance.
   *
   * @example
   * const arcText = new ArcText(document.getElementById('myElement'));
   *
   * // Restore `myElement` to its original state.
   * arcText.destroy();
   */


  ArcText.prototype.refresh = function () {
    return this.invalidate();
  };
  /**
   * Invalidates the current state and schedules a task to refresh the layout
   * in the next animation frame.
   *
   * @private
   *
   * @return {ArcText} This instance.
   */


  ArcText.prototype.invalidate = function () {
    var _this = this; // if(this.raf) {


    cancelAnimationFrame(this.raf); // }

    this.raf = requestAnimationFrame(function () {
      _this.render();
    });
    return this;
  };
  /**
   * Rotates and positions the letters.
   *
   * @private
   *
   * @return {ArcText} This instance.
   */


  ArcText.prototype.render = function () {
    var _this = this;

    var originY = this.dir === -1 ? -this.radius + this.lineHeight : this.radius;
    var origin = "center " + originY / this.fontSize + "em";
    var innerRadius = this.radius - this.lineHeight;

    var _a = getLetterRotations(this.metrics, innerRadius),
        rotations = _a.rotations,
        θ = _a.θ;

    this.letters.forEach(function (letter, index) {
      var style = letter.style;
      var rotate = (θ * -0.5 + rotations[index]) * _this.dir;
      var translateX = _this.metrics[index].width * -0.5 / _this.fontSize;
      var transform = "translateX(" + translateX + "em) rotate(" + rotate + "deg)";
      style.position = 'absolute';
      style.bottom = _this.dir === -1 ? '0' : 'auto';
      style.left = '50%';
      style.transform = transform;
      style.transformOrigin = origin; // style.webkitTransform = transform;
      // style.webkitTransformOrigin = origin;
    });

    if (this.isForceHeight) {
      var height = θ > 180 ? sagitta(this.radius, θ) : sagitta(innerRadius, θ) + this.lineHeight;
      this.container.style.height = height / this.fontSize + "em";
    }

    if (this.isForceWidth) {
      var width = chord(this.radius, min(180, θ));
      this.container.style.width = width / this.fontSize + "em";
    }

    return this;
  };

  return ArcText;
}();

var _default = ArcText;
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _arcText = _interopRequireDefault(require("arc-text"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.onload = function () {
  var title = document.querySelector('header h1');
  var arcTitle = new _arcText.default(title);
  arcTitle.arc(360);
};
},{"arc-text":"node_modules/arc-text/dist/arc-text.es5.js"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55071" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/version8.e31bb0bc.js.map