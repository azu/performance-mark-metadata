(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw ((f.code = "MODULE_NOT_FOUND"), f);
            }
            var l = (n[o] = { exports: {} });
            t[o][0].call(
                l.exports,
                function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                },
                l,
                l.exports,
                e,
                t,
                n,
                r
            );
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})(
    {
        1: [
            function(require, module, exports) {
                // MIT © 2017 azu
                "use strict";
                const { PerformanceMetadataMarker } = require("performance-mark-metadata");
                const marker = new PerformanceMetadataMarker();
                const outputTextField = document.getElementById("js-output");
                // main content

                const canvasContext = document.getElementById("js-canvas").getContext("2d");

                function render() {
                    canvasContext.clearRect(0, 0, 320, 320);
                    canvasContext.font = "24px serif";
                    canvasContext.fillText(new Date().toISOString(), 0, 100);
                    requestAnimationFrame(render);
                }

                render();
                // fps
                const FpsEmitter = require("fps-emitter");
                const fps = new FpsEmitter();
                fps.on("update", function(FPS) {
                    // mark current FPS
                    marker.mark("FPS", {
                        details: {
                            FPS: FPS
                        }
                    });

                    const pageLoad = performance.timing.navigationStart;
                    const output = performance.getEntriesByType("mark").map(entry => {
                        const meta = marker.getEntryMetadata(entry);
                        return {
                            type: entry.name,
                            timeStamp: pageLoad + entry.startTime,
                            meta: meta
                        };
                    });
                    outputTextField.textContent = JSON.stringify(output, null, 4);
                });
                // defined heavy task
                const heavyTaskButton = document.getElementById("js-button");
                heavyTaskButton.addEventListener("click", () => {
                    marker.mark("Heavy Action");

                    // It is junk code
                    function getRndColor() {
                        const r = (255 * Math.random()) | 0,
                            g = (255 * Math.random()) | 0,
                            b = (255 * Math.random()) | 0;
                        return "rgb(" + r + "," + g + "," + b + ")";
                    }

                    for (let i = 0; i < 5; i++) {
                        let x = 0;
                        let y = 0;
                        const width = document.getElementById("js-canvas2").width;
                        const canvasContext = document.getElementById("js-canvas2").getContext("2d");
                        for (; y < width; y++) {
                            // walk x/y grid
                            for (x = 0; x < width; x++) {
                                canvasContext.fillStyle = getRndColor(); // set random color
                                canvasContext.fillRect(x, y, 1, 1); // draw a pixel
                            }
                        }
                    }
                });
            },
            { "fps-emitter": 3, "performance-mark-metadata": 8 }
        ],
        2: [
            function(require, module, exports) {
                // Copyright Joyent, Inc. and other Node contributors.
                //
                // Permission is hereby granted, free of charge, to any person obtaining a
                // copy of this software and associated documentation files (the
                // "Software"), to deal in the Software without restriction, including
                // without limitation the rights to use, copy, modify, merge, publish,
                // distribute, sublicense, and/or sell copies of the Software, and to permit
                // persons to whom the Software is furnished to do so, subject to the
                // following conditions:
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
                // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
                // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
                // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
                // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
                // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
                // USE OR OTHER DEALINGS IN THE SOFTWARE.

                function EventEmitter() {
                    this._events = this._events || {};
                    this._maxListeners = this._maxListeners || undefined;
                }
                module.exports = EventEmitter;

                // Backwards-compat with node 0.10.x
                EventEmitter.EventEmitter = EventEmitter;

                EventEmitter.prototype._events = undefined;
                EventEmitter.prototype._maxListeners = undefined;

                // By default EventEmitters will print a warning if more than 10 listeners are
                // added to it. This is a useful default which helps finding memory leaks.
                EventEmitter.defaultMaxListeners = 10;

                // Obviously not all Emitters should be limited to 10. This function allows
                // that to be increased. Set to zero for unlimited.
                EventEmitter.prototype.setMaxListeners = function(n) {
                    if (!isNumber(n) || n < 0 || isNaN(n)) throw TypeError("n must be a positive number");
                    this._maxListeners = n;
                    return this;
                };

                EventEmitter.prototype.emit = function(type) {
                    var er, handler, len, args, i, listeners;

                    if (!this._events) this._events = {};

                    // If there is no 'error' event listener then throw.
                    if (type === "error") {
                        if (!this._events.error || (isObject(this._events.error) && !this._events.error.length)) {
                            er = arguments[1];
                            if (er instanceof Error) {
                                throw er; // Unhandled 'error' event
                            } else {
                                // At least give some kind of context to the user
                                var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
                                err.context = er;
                                throw err;
                            }
                        }
                    }

                    handler = this._events[type];

                    if (isUndefined(handler)) return false;

                    if (isFunction(handler)) {
                        switch (arguments.length) {
                            // fast cases
                            case 1:
                                handler.call(this);
                                break;
                            case 2:
                                handler.call(this, arguments[1]);
                                break;
                            case 3:
                                handler.call(this, arguments[1], arguments[2]);
                                break;
                            // slower
                            default:
                                args = Array.prototype.slice.call(arguments, 1);
                                handler.apply(this, args);
                        }
                    } else if (isObject(handler)) {
                        args = Array.prototype.slice.call(arguments, 1);
                        listeners = handler.slice();
                        len = listeners.length;
                        for (i = 0; i < len; i++) listeners[i].apply(this, args);
                    }

                    return true;
                };

                EventEmitter.prototype.addListener = function(type, listener) {
                    var m;

                    if (!isFunction(listener)) throw TypeError("listener must be a function");

                    if (!this._events) this._events = {};

                    // To avoid recursion in the case that type === "newListener"! Before
                    // adding it to the listeners, first emit "newListener".
                    if (this._events.newListener)
                        this.emit("newListener", type, isFunction(listener.listener) ? listener.listener : listener);

                    if (!this._events[type])
                        // Optimize the case of one listener. Don't need the extra array object.
                        this._events[type] = listener;
                    else if (isObject(this._events[type]))
                        // If we've already got an array, just append.
                        this._events[type].push(listener);
                    else
                        // Adding the second element, need to change to array.
                        this._events[type] = [this._events[type], listener];

                    // Check for listener leak
                    if (isObject(this._events[type]) && !this._events[type].warned) {
                        if (!isUndefined(this._maxListeners)) {
                            m = this._maxListeners;
                        } else {
                            m = EventEmitter.defaultMaxListeners;
                        }

                        if (m && m > 0 && this._events[type].length > m) {
                            this._events[type].warned = true;
                            console.error(
                                "(node) warning: possible EventEmitter memory " +
                                    "leak detected. %d listeners added. " +
                                    "Use emitter.setMaxListeners() to increase limit.",
                                this._events[type].length
                            );
                            if (typeof console.trace === "function") {
                                // not supported in IE 10
                                console.trace();
                            }
                        }
                    }

                    return this;
                };

                EventEmitter.prototype.on = EventEmitter.prototype.addListener;

                EventEmitter.prototype.once = function(type, listener) {
                    if (!isFunction(listener)) throw TypeError("listener must be a function");

                    var fired = false;

                    function g() {
                        this.removeListener(type, g);

                        if (!fired) {
                            fired = true;
                            listener.apply(this, arguments);
                        }
                    }

                    g.listener = listener;
                    this.on(type, g);

                    return this;
                };

                // emits a 'removeListener' event iff the listener was removed
                EventEmitter.prototype.removeListener = function(type, listener) {
                    var list, position, length, i;

                    if (!isFunction(listener)) throw TypeError("listener must be a function");

                    if (!this._events || !this._events[type]) return this;

                    list = this._events[type];
                    length = list.length;
                    position = -1;

                    if (list === listener || (isFunction(list.listener) && list.listener === listener)) {
                        delete this._events[type];
                        if (this._events.removeListener) this.emit("removeListener", type, listener);
                    } else if (isObject(list)) {
                        for (i = length; i-- > 0; ) {
                            if (list[i] === listener || (list[i].listener && list[i].listener === listener)) {
                                position = i;
                                break;
                            }
                        }

                        if (position < 0) return this;

                        if (list.length === 1) {
                            list.length = 0;
                            delete this._events[type];
                        } else {
                            list.splice(position, 1);
                        }

                        if (this._events.removeListener) this.emit("removeListener", type, listener);
                    }

                    return this;
                };

                EventEmitter.prototype.removeAllListeners = function(type) {
                    var key, listeners;

                    if (!this._events) return this;

                    // not listening for removeListener, no need to emit
                    if (!this._events.removeListener) {
                        if (arguments.length === 0) this._events = {};
                        else if (this._events[type]) delete this._events[type];
                        return this;
                    }

                    // emit removeListener for all listeners on all events
                    if (arguments.length === 0) {
                        for (key in this._events) {
                            if (key === "removeListener") continue;
                            this.removeAllListeners(key);
                        }
                        this.removeAllListeners("removeListener");
                        this._events = {};
                        return this;
                    }

                    listeners = this._events[type];

                    if (isFunction(listeners)) {
                        this.removeListener(type, listeners);
                    } else if (listeners) {
                        // LIFO order
                        while (listeners.length) this.removeListener(type, listeners[listeners.length - 1]);
                    }
                    delete this._events[type];

                    return this;
                };

                EventEmitter.prototype.listeners = function(type) {
                    var ret;
                    if (!this._events || !this._events[type]) ret = [];
                    else if (isFunction(this._events[type])) ret = [this._events[type]];
                    else ret = this._events[type].slice();
                    return ret;
                };

                EventEmitter.prototype.listenerCount = function(type) {
                    if (this._events) {
                        var evlistener = this._events[type];

                        if (isFunction(evlistener)) return 1;
                        else if (evlistener) return evlistener.length;
                    }
                    return 0;
                };

                EventEmitter.listenerCount = function(emitter, type) {
                    return emitter.listenerCount(type);
                };

                function isFunction(arg) {
                    return typeof arg === "function";
                }

                function isNumber(arg) {
                    return typeof arg === "number";
                }

                function isObject(arg) {
                    return typeof arg === "object" && arg !== null;
                }

                function isUndefined(arg) {
                    return arg === void 0;
                }
            },
            {}
        ],
        3: [
            function(require, module, exports) {
                // --------------------------------------------------------------
                //
                // Microsoft Edge fps-emitter
                // Copyright(c) Microsoft Corporation
                // All rights reserved.
                //
                // MIT License
                //
                // Permission is hereby granted, free of charge, to any person obtaining
                // a copy of this software and associated documentation files(the ""Software""),
                // to deal in the Software without restriction, including without limitation the rights
                // to use, copy, modify, merge, publish, distribute, sublicense, and / or sell copies
                // of the Software, and to permit persons to whom the Software is furnished to do so,
                // subject to the following conditions :
                //
                // The above copyright notice and this permission notice shall be included
                // in all copies or substantial portions of the Software.
                //
                // THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
                // INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
                // FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS
                // OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
                // WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF
                // OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
                //
                // --------------------------------------------------------------
                "use strict";

                /* global performance */

                var DEFAULT_UPDATE_INTERVAL = 1000;

                var raf = require("raf");
                var EE = require("events").EventEmitter;
                var inherits = require("inherits");

                inherits(FpsEmitter, EE);

                function FpsEmitter(interval) {
                    if (!(this instanceof FpsEmitter)) {
                        return new FpsEmitter(interval);
                    }
                    EE.call(this);

                    this.setUpdateInterval(interval);

                    // avoid functions-within-functions, use bound functions for perf
                    this.__onRaf = this.__onRaf.bind(this);

                    this.__fps = 0;
                    this.__total = 0;
                    this.__samples = 0;
                    this.__lastSample = this.__lastSampleBatch = performance.now();

                    raf(this.__onRaf);
                }

                FpsEmitter.prototype.__onRaf = function() {
                    // update the new timestamp and total intervals recorded
                    var newTS = performance.now();
                    this.__samples++;
                    this.__total += newTS - this.__lastSample;
                    if (newTS - this.__lastSampleBatch >= this.__interval) {
                        // calculate the rolling average
                        var fps = 1000 / (this.__total / this.__samples);
                        // clamp to 60, use ~~ as a fast Math.floor()
                        fps = fps > 60 ? 60 : ~~fps;
                        if (this.__fps !== fps) {
                            // emit when changed
                            this.__fps = fps;
                            this.emit("update", fps);
                        }
                        // reset
                        this.__total = 0;
                        this.__samples = 0;
                        this.__lastSampleBatch = newTS;
                    }
                    this.__lastSample = newTS;
                    raf(this.__onRaf);
                };

                FpsEmitter.prototype.setUpdateInterval = function(interval) {
                    this.__interval = typeof interval === "number" && interval > 0 ? interval : DEFAULT_UPDATE_INTERVAL;
                };

                FpsEmitter.prototype.get = function() {
                    return this.__fps;
                };

                module.exports = FpsEmitter;
            },
            { events: 2, inherits: 4, raf: 7 }
        ],
        4: [
            function(require, module, exports) {
                if (typeof Object.create === "function") {
                    // implementation from standard node.js 'util' module
                    module.exports = function inherits(ctor, superCtor) {
                        ctor.super_ = superCtor;
                        ctor.prototype = Object.create(superCtor.prototype, {
                            constructor: {
                                value: ctor,
                                enumerable: false,
                                writable: true,
                                configurable: true
                            }
                        });
                    };
                } else {
                    // old school shim for old browsers
                    module.exports = function inherits(ctor, superCtor) {
                        ctor.super_ = superCtor;
                        var TempCtor = function() {};
                        TempCtor.prototype = superCtor.prototype;
                        ctor.prototype = new TempCtor();
                        ctor.prototype.constructor = ctor;
                    };
                }
            },
            {}
        ],
        5: [
            function(require, module, exports) {
                (function(process) {
                    // Generated by CoffeeScript 1.12.2
                    (function() {
                        var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

                        if (typeof performance !== "undefined" && performance !== null && performance.now) {
                            module.exports = function() {
                                return performance.now();
                            };
                        } else if (typeof process !== "undefined" && process !== null && process.hrtime) {
                            module.exports = function() {
                                return (getNanoSeconds() - nodeLoadTime) / 1e6;
                            };
                            hrtime = process.hrtime;
                            getNanoSeconds = function() {
                                var hr;
                                hr = hrtime();
                                return hr[0] * 1e9 + hr[1];
                            };
                            moduleLoadTime = getNanoSeconds();
                            upTime = process.uptime() * 1e9;
                            nodeLoadTime = moduleLoadTime - upTime;
                        } else if (Date.now) {
                            module.exports = function() {
                                return Date.now() - loadTime;
                            };
                            loadTime = Date.now();
                        } else {
                            module.exports = function() {
                                return new Date().getTime() - loadTime;
                            };
                            loadTime = new Date().getTime();
                        }
                    }.call(this));
                }.call(this, require("_process")));
            },
            { _process: 6 }
        ],
        6: [
            function(require, module, exports) {
                // shim for using process in browser
                var process = (module.exports = {});

                // cached from whatever global is present so that test runners that stub it
                // don't break things.  But we need to wrap it in a try catch in case it is
                // wrapped in strict mode code which doesn't define any globals.  It's inside a
                // function because try/catches deoptimize in certain engines.

                var cachedSetTimeout;
                var cachedClearTimeout;

                function defaultSetTimout() {
                    throw new Error("setTimeout has not been defined");
                }
                function defaultClearTimeout() {
                    throw new Error("clearTimeout has not been defined");
                }
                (function() {
                    try {
                        if (typeof setTimeout === "function") {
                            cachedSetTimeout = setTimeout;
                        } else {
                            cachedSetTimeout = defaultSetTimout;
                        }
                    } catch (e) {
                        cachedSetTimeout = defaultSetTimout;
                    }
                    try {
                        if (typeof clearTimeout === "function") {
                            cachedClearTimeout = clearTimeout;
                        } else {
                            cachedClearTimeout = defaultClearTimeout;
                        }
                    } catch (e) {
                        cachedClearTimeout = defaultClearTimeout;
                    }
                })();
                function runTimeout(fun) {
                    if (cachedSetTimeout === setTimeout) {
                        //normal enviroments in sane situations
                        return setTimeout(fun, 0);
                    }
                    // if setTimeout wasn't available but was latter defined
                    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
                        cachedSetTimeout = setTimeout;
                        return setTimeout(fun, 0);
                    }
                    try {
                        // when when somebody has screwed with setTimeout but no I.E. maddness
                        return cachedSetTimeout(fun, 0);
                    } catch (e) {
                        try {
                            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
                            return cachedSetTimeout.call(null, fun, 0);
                        } catch (e) {
                            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
                            return cachedSetTimeout.call(this, fun, 0);
                        }
                    }
                }
                function runClearTimeout(marker) {
                    if (cachedClearTimeout === clearTimeout) {
                        //normal enviroments in sane situations
                        return clearTimeout(marker);
                    }
                    // if clearTimeout wasn't available but was latter defined
                    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
                        cachedClearTimeout = clearTimeout;
                        return clearTimeout(marker);
                    }
                    try {
                        // when when somebody has screwed with setTimeout but no I.E. maddness
                        return cachedClearTimeout(marker);
                    } catch (e) {
                        try {
                            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
                            return cachedClearTimeout.call(null, marker);
                        } catch (e) {
                            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
                            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
                            return cachedClearTimeout.call(this, marker);
                        }
                    }
                }
                var queue = [];
                var draining = false;
                var currentQueue;
                var queueIndex = -1;

                function cleanUpNextTick() {
                    if (!draining || !currentQueue) {
                        return;
                    }
                    draining = false;
                    if (currentQueue.length) {
                        queue = currentQueue.concat(queue);
                    } else {
                        queueIndex = -1;
                    }
                    if (queue.length) {
                        drainQueue();
                    }
                }

                function drainQueue() {
                    if (draining) {
                        return;
                    }
                    var timeout = runTimeout(cleanUpNextTick);
                    draining = true;

                    var len = queue.length;
                    while (len) {
                        currentQueue = queue;
                        queue = [];
                        while (++queueIndex < len) {
                            if (currentQueue) {
                                currentQueue[queueIndex].run();
                            }
                        }
                        queueIndex = -1;
                        len = queue.length;
                    }
                    currentQueue = null;
                    draining = false;
                    runClearTimeout(timeout);
                }

                process.nextTick = function(fun) {
                    var args = new Array(arguments.length - 1);
                    if (arguments.length > 1) {
                        for (var i = 1; i < arguments.length; i++) {
                            args[i - 1] = arguments[i];
                        }
                    }
                    queue.push(new Item(fun, args));
                    if (queue.length === 1 && !draining) {
                        runTimeout(drainQueue);
                    }
                };

                // v8 likes predictible objects
                function Item(fun, array) {
                    this.fun = fun;
                    this.array = array;
                }
                Item.prototype.run = function() {
                    this.fun.apply(null, this.array);
                };
                process.title = "browser";
                process.browser = true;
                process.env = {};
                process.argv = [];
                process.version = ""; // empty string to avoid regexp issues
                process.versions = {};

                function noop() {}

                process.on = noop;
                process.addListener = noop;
                process.once = noop;
                process.off = noop;
                process.removeListener = noop;
                process.removeAllListeners = noop;
                process.emit = noop;
                process.prependListener = noop;
                process.prependOnceListener = noop;

                process.listeners = function(name) {
                    return [];
                };

                process.binding = function(name) {
                    throw new Error("process.binding is not supported");
                };

                process.cwd = function() {
                    return "/";
                };
                process.chdir = function(dir) {
                    throw new Error("process.chdir is not supported");
                };
                process.umask = function() {
                    return 0;
                };
            },
            {}
        ],
        7: [
            function(require, module, exports) {
                (function(global) {
                    var now = require("performance-now"),
                        root = typeof window === "undefined" ? global : window,
                        vendors = ["moz", "webkit"],
                        suffix = "AnimationFrame",
                        raf = root["request" + suffix],
                        caf = root["cancel" + suffix] || root["cancelRequest" + suffix];

                    for (var i = 0; !raf && i < vendors.length; i++) {
                        raf = root[vendors[i] + "Request" + suffix];
                        caf = root[vendors[i] + "Cancel" + suffix] || root[vendors[i] + "CancelRequest" + suffix];
                    }

                    // Some versions of FF have rAF but not cAF
                    if (!raf || !caf) {
                        var last = 0,
                            id = 0,
                            queue = [],
                            frameDuration = 1000 / 60;

                        raf = function(callback) {
                            if (queue.length === 0) {
                                var _now = now(),
                                    next = Math.max(0, frameDuration - (_now - last));
                                last = next + _now;
                                setTimeout(function() {
                                    var cp = queue.slice(0);
                                    // Clear queue here to prevent
                                    // callbacks from appending listeners
                                    // to the current frame's queue
                                    queue.length = 0;
                                    for (var i = 0; i < cp.length; i++) {
                                        if (!cp[i].cancelled) {
                                            try {
                                                cp[i].callback(last);
                                            } catch (e) {
                                                setTimeout(function() {
                                                    throw e;
                                                }, 0);
                                            }
                                        }
                                    }
                                }, Math.round(next));
                            }
                            queue.push({
                                handle: ++id,
                                callback: callback,
                                cancelled: false
                            });
                            return id;
                        };

                        caf = function(handle) {
                            for (var i = 0; i < queue.length; i++) {
                                if (queue[i].handle === handle) {
                                    queue[i].cancelled = true;
                                }
                            }
                        };
                    }

                    module.exports = function(fn) {
                        // Wrap in a new function to prevent
                        // `cancel` potentially being assigned
                        // to the native rAF function
                        return raf.call(root, fn);
                    };
                    module.exports.cancel = function() {
                        caf.apply(root, arguments);
                    };
                    module.exports.polyfill = function(object) {
                        if (!object) {
                            object = root;
                        }
                        object.requestAnimationFrame = raf;
                        object.cancelAnimationFrame = caf;
                    };
                }.call(
                    this,
                    typeof global !== "undefined"
                        ? global
                        : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {}
                ));
            },
            { "performance-now": 5 }
        ],
        8: [
            function(require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: true });
                var map_like_1 = require("map-like");
                var PerformanceMetadataMarker = /** @class */ (function() {
                    function PerformanceMetadataMarker(args) {
                        if (args === void 0) {
                            args = {};
                        }
                        this.metadataMap = new map_like_1.MapLike();
                        this.performance = args.performance || performance;
                    }
                    /**
                     * Mark `name` with `metadata`
                     * You can get the `metadata` by using `getEntryMetadata`.
                     */
                    PerformanceMetadataMarker.prototype.mark = function(name, metadata) {
                        this.performance.mark(name);
                        if (!metadata) {
                            return;
                        }
                        var entries = this.performance.getEntriesByName(name);
                        var currentMark = entries[entries.length - 1];
                        if (currentMark) {
                            this.metadataMap.set(currentMark, metadata);
                        }
                    };
                    /**
                     * Return a metadata if match the `entry`
                     */
                    PerformanceMetadataMarker.prototype.getEntryMetadata = function(entry) {
                        return this.metadataMap.get(entry);
                    };
                    /**
                     * Clear a metadata for `entry`
                     */
                    PerformanceMetadataMarker.prototype.clearEntryMetadata = function(entry) {
                        return this.metadataMap.delete(entry);
                    };
                    /**
                     * Clear all metadata
                     */
                    PerformanceMetadataMarker.prototype.clear = function() {
                        return this.metadataMap.clear();
                    };
                    return PerformanceMetadataMarker;
                })();
                exports.PerformanceMetadataMarker = PerformanceMetadataMarker;
            },
            { "map-like": 9 }
        ],
        9: [
            function(require, module, exports) {
                // LICENSE : MIT
                "use strict";
                // constants

                Object.defineProperty(exports, "__esModule", {
                    value: true
                });

                var _createClass = (function() {
                    function defineProperties(target, props) {
                        for (var i = 0; i < props.length; i++) {
                            var descriptor = props[i];
                            descriptor.enumerable = descriptor.enumerable || false;
                            descriptor.configurable = true;
                            if ("value" in descriptor) descriptor.writable = true;
                            Object.defineProperty(target, descriptor.key, descriptor);
                        }
                    }
                    return function(Constructor, protoProps, staticProps) {
                        if (protoProps) defineProperties(Constructor.prototype, protoProps);
                        if (staticProps) defineProperties(Constructor, staticProps);
                        return Constructor;
                    };
                })();

                function _classCallCheck(instance, Constructor) {
                    if (!(instance instanceof Constructor)) {
                        throw new TypeError("Cannot call a class as a function");
                    }
                }

                var NanSymbolMark = {};

                function encodeKey(key) {
                    var isNotNumber = typeof key === "number" && key !== key;
                    return isNotNumber ? NanSymbolMark : key;
                }

                function decodeKey(encodedKey) {
                    return encodedKey === NanSymbolMark ? NaN : encodedKey;
                }

                /**
                 * ES6 Map like object.
                 * See [Map - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map "Map - JavaScript | MDN")
                 */

                var MapLike = (exports.MapLike = (function() {
                    function MapLike() {
                        var _this = this;

                        var entries = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

                        _classCallCheck(this, MapLike);

                        /**
                         * @type {Array}
                         * @private
                         */
                        this._keys = [];
                        /**
                         *
                         * @type {Array}
                         * @private
                         */
                        this._values = [];
                        entries.forEach(function(entry) {
                            if (!Array.isArray(entry)) {
                                throw new Error("should be `new MapLike([ [key, value] ])`");
                            }
                            if (entry.length !== 2) {
                                throw new Error("should be `new MapLike([ [key, value] ])`");
                            }
                            _this.set(entry[0], entry[1]);
                        });
                    }

                    /**
                     * return map size
                     * @returns {Number}
                     */

                    _createClass(MapLike, [
                        {
                            key: "entries",

                            /**
                             * entries [[key, value], [key, value]] value
                             * @returns {Array}
                             */
                            value: function entries() {
                                var _this2 = this;

                                return this.keys().map(function(key) {
                                    var value = _this2.get(key);
                                    return [decodeKey(key), value];
                                });
                            }

                            /**
                             * get keys
                             * @returns {Array}
                             */
                        },
                        {
                            key: "keys",
                            value: function keys() {
                                return this._keys
                                    .filter(function(value) {
                                        return value !== undefined;
                                    })
                                    .map(decodeKey);
                            }

                            /**
                             * get values
                             * @returns {Array}
                             */
                        },
                        {
                            key: "values",
                            value: function values() {
                                return this._values.slice();
                            }

                            /**
                             * @param {*} key - The key of the element to return from the Map object.
                             * @returns {*}
                             */
                        },
                        {
                            key: "get",
                            value: function get(key) {
                                var idx = this._keys.indexOf(encodeKey(key));
                                return idx !== -1 ? this._values[idx] : undefined;
                            }

                            /**
                             * has value of key
                             * @param {*} key - The key of the element to return from the Map object.
                             * @returns {boolean}
                             */
                        },
                        {
                            key: "has",
                            value: function has(key) {
                                return this._keys.indexOf(encodeKey(key)) !== -1;
                            }

                            /**
                             * set value for key
                             * @param {*} key - The key of the element to return from the Map object.
                             * @param {*} value
                             * @return {MapLike}
                             */
                        },
                        {
                            key: "set",
                            value: function set(key, value) {
                                var idx = this._keys.indexOf(encodeKey(key));
                                if (idx !== -1) {
                                    this._values[idx] = value;
                                } else {
                                    this._keys.push(encodeKey(key));
                                    this._values.push(value);
                                }
                                return this;
                            }

                            /**
                             * delete value for key
                             * @param {*} key - The key of the element to return from the Map object.
                             * @returns {boolean}
                             */
                        },
                        {
                            key: "delete",
                            value: function _delete(key) {
                                var idx = this._keys.indexOf(encodeKey(key));
                                if (idx === -1) {
                                    return false;
                                }
                                this._keys.splice(idx, 1);
                                this._values.splice(idx, 1);
                                return true;
                            }

                            /**
                             * clear defined key,value
                             * @returns {MapLike}
                             */
                        },
                        {
                            key: "clear",
                            value: function clear() {
                                this._keys = [];
                                this._values = [];
                                return this;
                            }

                            /**
                             * forEach map
                             * @param {function(value, key, map)} handler
                             * @param {*} [thisArg]
                             */
                        },
                        {
                            key: "forEach",
                            value: function forEach(handler, thisArg) {
                                var _this3 = this;

                                this.keys().forEach(function(key) {
                                    // value, key, map
                                    handler(_this3.get(key), key, thisArg || _this3);
                                });
                            }
                        },
                        {
                            key: "size",
                            get: function get() {
                                return this._values.filter(function(value) {
                                    return value !== undefined;
                                }).length;
                            }
                        }
                    ]);

                    return MapLike;
                })());
            },
            {}
        ]
    },
    {},
    [1]
);
