webpackJsonp([0], {

    /***/
    0:
        /***/
        (function(module, exports, __webpack_require__) {

            'use strict';

            __webpack_require__(1);

            __webpack_require__(333);

            __webpack_require__(334);

            __webpack_require__(335);

            __webpack_require__(336);

            __webpack_require__(339);

            __webpack_require__(340);

            /***/
        }),

    /***/
    333:
        /***/
        (function(module, exports) {

            'use strict';

            $(document).ready(function() {
                $('.trigger').on('click', function(event) {
                    event.preventDefault();

                    $('.menu, body').toggleClass('show');
                });

                $(window).scroll(function() {
                    if ($(document).scrollTop() >= 75) {
                        $('.trigger').addClass('fixed');
                    } else {
                        $('.trigger').removeClass('fixed');
                    }
                });

                $(window).scroll(function() {
                    if ($(document).scrollTop() >= 300) {
                        $('.menu-fixer h1').addClass('show');
                    } else {
                        $('.menu-fixer h1').removeClass('show');
                    }
                });

                $(window).scroll(function() {
                    if ($(document).scrollTop() >= 1200) {
                        $(document.body).addClass('details');
                    } else {
                        $(document.body).removeClass('details');
                    }
                });

                $('.arrow-up').on('click', function() {
                    $("body").animate({
                        scrollTop: 0
                    });
                });
            });

            /***/
        }),

    /***/
    334:
        /***/
        (function(module, exports) {

            'use strict';

            $(document).ready(function() {

                var arrayUnique = function arrayUnique(a) {
                    return a.reduce(function(p, c) {
                        if (p.indexOf(c) < 0) p.push(c);
                        return p;
                    }, []);
                };

                var titleCase = function titleCase(str) {
                    return str.replace(/-/, ' ').replace(/\w\S*/g, function(txt) {
                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                    });
                };

                var filterArticles = function filterArticles(filterProp, filterVal) {
                    var allArticles = document.querySelectorAll('main article');
                    $(allArticles).hide().filter(function() {
                        var re = new RegExp(filterVal);
                        return re.test($(this).data(filterProp));
                    }).show();
                };

                if ($('.filter-nav').length > 0) {

                    // Events
                    $('.filter-nav').on('click', '.action a', function(e) {
                        e.preventDefault();
                        if ($(this).hasClass('active')) {
                            $(this).removeClass('active');
                            $('section[data-filterid]').hide();
                        } else {
                            $(this).addClass('active').siblings().removeClass('active');
                            var filterid = $(this).data('filterby');
                            $('section[data-filterid=filter' + filterid + ']').show().siblings('.values').hide();
                        }
                    });

                    $('.filter-nav').on('click', '.values a', function(e) {
                        e.preventDefault();
                        var filterProp = $(this).parents('section').data('filterid');
                        var filterVal = $(this).data('filterby');
                        // Regexp, match year to decade
                        if (filterProp == 'filterYear') filterVal = new RegExp(filterVal.replace(/(19\d).*$/, "$1.*"));
                        if ($(this).hasClass('active')) {
                            $(this).parent().parent().find('.active').removeClass('active');
                            filterArticles(filterProp, '');
                        } else {
                            $(this).parent().parent().find('.active').removeClass('active');
                            $(this).addClass('active');
                            filterArticles(filterProp, filterVal);
                        }
                    });

                    // Create nav
                    var promptHtml = '<section class="prompt"> \
	      <p>Search by:</p> \
	    </section>';

                    var allArticles = document.querySelectorAll('main article');
                    var allDataObj = {};
                    $(allArticles).map(function(i, a) {
                        var o = $(a).data();
                        for (var prop in o) {
                            if (o.hasOwnProperty(prop)) {
                                if (!allDataObj[prop]) allDataObj[prop] = [];
                                allDataObj[prop] = allDataObj[prop].concat(('' + o[prop]).split(', '));
                            }
                        }
                    });

                    var categoriesHTML = Object.keys(allDataObj).sort().map(function(k) {
                        var type = k.replace('filter', '');
                        return '<a href="#" data-filterby="' + type + '">' + type + '</a>';
                    });

                    var actionsHtml = '<section class="action">' + categoriesHTML.join("\n") + '</section>';

                    var categoryValuesHTML = '';
                    for (var prop in allDataObj) {
                        if (allDataObj.hasOwnProperty(prop)) {
                            categoryValuesHTML += '<section class="values" data-filterid="' + prop + '"><div>';
                            if (prop == 'filterDesigner' || prop == 'filterName') {
                                // Sort designer names by last name
                                allDataObj[prop].sort(function(a, b) {
                                    var aSplit = a.split(' '),
                                        bSplit = b.split(' ');
                                    return aSplit[aSplit.length - 1] < bSplit[bSplit.length - 1] ? -1 : 1;
                                });
                            } else if (prop == 'filterYear') {
                                // Combine years into decades
                                allDataObj[prop] = allDataObj[prop].map(function(d) {
                                    return d.replace(/(19\d).*$/, "$10’s");
                                }).sort();
                            } else {
                                allDataObj[prop].sort();
                            }
                            var values = arrayUnique(allDataObj[prop]).filter(Boolean);
                            var links = values.map(function(v) {
                                var shortenedName = v;
                                if ((prop == 'filterDesigner' || prop == 'filterName') && /\s/.test(v)) shortenedName = shortenedName.replace(/^([A-Z])[a-z]*/g, "$1.");
                                if (prop == 'filterType') shortenedName = titleCase(shortenedName);
                                return '<a href="#" data-filterby="' + v + '">' + shortenedName + '</a>';
                            });
                            links.unshift('<a href="#" data-filterby="" class="active">All</a>');
                            var chunkedArray = [];
                            var chunkSize = Math.ceil(links.length / 4);
                            for (var i = 0, j = links.length, chunk = chunkSize < 4 ? 4 : chunkSize; i < j; i += chunk) {
                                chunkedArray.push(links.slice(i, i + chunk));
                            }
                            var html = chunkedArray.slice(0, 4).map(function(arr) {
                                return '<div>' + arr.join('') + '</div>';
                            });
                            categoryValuesHTML += html.join('') + '</div></section>';
                        }
                    }

                    $('.filter-nav').html(promptHtml + actionsHtml + categoryValuesHTML);
                }
            });

            /***/
        }),

    /***/
    335:
        /***/
        (function(module, exports) {

            'use strict';

            window.createGallery = function(container) {
                if ($('.archive-current-images').length) {
                    $(document.body).addClass('lightbox-open');
                    $(window).on('touchmove', function(event) {
                        if ($(document.body).hasClass('lightbox-open')) event.preventDefault();
                    });
                }
                var $gallery = $('.archive-current-images', container).flickity({
                    imagesLoaded: true,
                    wrapAround: true,
                    pageDots: false,
                    prevNextButtons: true,
                    setGallerySize: false,
                    draggable: true
                });

                var flkty = $gallery.data('flickity');
                $gallery.on('select.flickity', function() {
                    var cellNumber = flkty.selectedIndex + 1;
                    $('.archive-current-image-counter', container).text(cellNumber + '/' + flkty.slides.length);
                });

                if (/#\d+/.test(document.location.hash)) {
                    $gallery.flickity('select', document.location.hash.replace(/#/, ''));
                }

                $('.archive-text-toggle', container).on('click', function(e) {
                    e.preventDefault();
                    $(this).parents('.archive-current').toggleClass('show--text');
                });
            };

            $(document).ready(function() {
                // init
                createGallery($('.archive-current'));
            });

            /***/
        }),

    /***/
    336:
        /***/
        (function(module, exports, __webpack_require__) {

            'use strict';

            var _imagesloaded = __webpack_require__(337);

            var _imagesloaded2 = _interopRequireDefault(_imagesloaded);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    default: obj
                };
            }

            window.loadImages = function() {
                $('[data-loaded="false"], img').each(function() {
                    var _this = this;

                    new _imagesloaded2.default(this, {
                        background: true
                    }, function() {
                        $(_this).attr('data-loaded', true);
                    });
                });
            };

            $(document).ready(function() {
                $('img').Lazy();
                loadImages();
            });

            /***/
        }),

    /***/
    337:
        /***/
        (function(module, exports, __webpack_require__) {

            var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
            'use strict';

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };

            /*!
             * imagesLoaded v4.1.4
             * JavaScript is all like "You images are done yet or what?"
             * MIT License
             */

            (function(window, factory) {
                'use strict';
                // universal module definition

                /*global define: false, module: false, require: false */

                if (true) {
                    // AMD
                    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(338)], __WEBPACK_AMD_DEFINE_RESULT__ = function(EvEmitter) {
                        return factory(window, EvEmitter);
                    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {
                    // CommonJS
                    module.exports = factory(window, require('ev-emitter'));
                } else {
                    // browser global
                    window.imagesLoaded = factory(window, window.EvEmitter);
                }
            })(typeof window !== 'undefined' ? window : undefined,

                // --------------------------  factory -------------------------- //

                function factory(window, EvEmitter) {

                    'use strict';

                    var $ = window.jQuery;
                    var console = window.console;

                    // -------------------------- helpers -------------------------- //

                    // extend objects
                    function extend(a, b) {
                        for (var prop in b) {
                            a[prop] = b[prop];
                        }
                        return a;
                    }

                    var arraySlice = Array.prototype.slice;

                    // turn element or nodeList into an array
                    function makeArray(obj) {
                        if (Array.isArray(obj)) {
                            // use object if already an array
                            return obj;
                        }

                        var isArrayLike = (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object' && typeof obj.length == 'number';
                        if (isArrayLike) {
                            // convert nodeList to array
                            return arraySlice.call(obj);
                        }

                        // array of single index
                        return [obj];
                    }

                    // -------------------------- imagesLoaded -------------------------- //

                    /**
                     * @param {Array, Element, NodeList, String} elem
                     * @param {Object or Function} options - if function, use as callback
                     * @param {Function} onAlways - callback function
                     */
                    function ImagesLoaded(elem, options, onAlways) {
                        // coerce ImagesLoaded() without new, to be new ImagesLoaded()
                        if (!(this instanceof ImagesLoaded)) {
                            return new ImagesLoaded(elem, options, onAlways);
                        }
                        // use elem as selector string
                        var queryElem = elem;
                        if (typeof elem == 'string') {
                            queryElem = document.querySelectorAll(elem);
                        }
                        // bail if bad element
                        if (!queryElem) {
                            console.error('Bad element for imagesLoaded ' + (queryElem || elem));
                            return;
                        }

                        this.elements = makeArray(queryElem);
                        this.options = extend({}, this.options);
                        // shift arguments if no options set
                        if (typeof options == 'function') {
                            onAlways = options;
                        } else {
                            extend(this.options, options);
                        }

                        if (onAlways) {
                            this.on('always', onAlways);
                        }

                        this.getImages();

                        if ($) {
                            // add jQuery Deferred object
                            this.jqDeferred = new $.Deferred();
                        }

                        // HACK check async to allow time to bind listeners
                        setTimeout(this.check.bind(this));
                    }

                    ImagesLoaded.prototype = Object.create(EvEmitter.prototype);

                    ImagesLoaded.prototype.options = {};

                    ImagesLoaded.prototype.getImages = function() {
                        this.images = [];

                        // filter & find items if we have an item selector
                        this.elements.forEach(this.addElementImages, this);
                    };

                    /**
                     * @param {Node} element
                     */
                    ImagesLoaded.prototype.addElementImages = function(elem) {
                        // filter siblings
                        if (elem.nodeName == 'IMG') {
                            this.addImage(elem);
                        }
                        // get background image on element
                        if (this.options.background === true) {
                            this.addElementBackgroundImages(elem);
                        }

                        // find children
                        // no non-element nodes, #143
                        var nodeType = elem.nodeType;
                        if (!nodeType || !elementNodeTypes[nodeType]) {
                            return;
                        }
                        var childImgs = elem.querySelectorAll('img');
                        // concat childElems to filterFound array
                        for (var i = 0; i < childImgs.length; i++) {
                            var img = childImgs[i];
                            this.addImage(img);
                        }

                        // get child background images
                        if (typeof this.options.background == 'string') {
                            var children = elem.querySelectorAll(this.options.background);
                            for (i = 0; i < children.length; i++) {
                                var child = children[i];
                                this.addElementBackgroundImages(child);
                            }
                        }
                    };

                    var elementNodeTypes = {
                        1: true,
                        9: true,
                        11: true
                    };

                    ImagesLoaded.prototype.addElementBackgroundImages = function(elem) {
                        var style = getComputedStyle(elem);
                        if (!style) {
                            // Firefox returns null if in a hidden iframe https://bugzil.la/548397
                            return;
                        }
                        // get url inside url("...")
                        var reURL = /url\((['"])?(.*?)\1\)/gi;
                        var matches = reURL.exec(style.backgroundImage);
                        while (matches !== null) {
                            var url = matches && matches[2];
                            if (url) {
                                this.addBackground(url, elem);
                            }
                            matches = reURL.exec(style.backgroundImage);
                        }
                    };

                    /**
                     * @param {Image} img
                     */
                    ImagesLoaded.prototype.addImage = function(img) {
                        var loadingImage = new LoadingImage(img);
                        this.images.push(loadingImage);
                    };

                    ImagesLoaded.prototype.addBackground = function(url, elem) {
                        var background = new Background(url, elem);
                        this.images.push(background);
                    };

                    ImagesLoaded.prototype.check = function() {
                        var _this = this;
                        this.progressedCount = 0;
                        this.hasAnyBroken = false;
                        // complete if no images
                        if (!this.images.length) {
                            this.complete();
                            return;
                        }

                        function onProgress(image, elem, message) {
                            // HACK - Chrome triggers event before object properties have changed. #83
                            setTimeout(function() {
                                _this.progress(image, elem, message);
                            });
                        }

                        this.images.forEach(function(loadingImage) {
                            loadingImage.once('progress', onProgress);
                            loadingImage.check();
                        });
                    };

                    ImagesLoaded.prototype.progress = function(image, elem, message) {
                        this.progressedCount++;
                        this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
                        // progress event
                        this.emitEvent('progress', [this, image, elem]);
                        if (this.jqDeferred && this.jqDeferred.notify) {
                            this.jqDeferred.notify(this, image);
                        }
                        // check if completed
                        if (this.progressedCount == this.images.length) {
                            this.complete();
                        }

                        if (this.options.debug && console) {
                            console.log('progress: ' + message, image, elem);
                        }
                    };

                    ImagesLoaded.prototype.complete = function() {
                        var eventName = this.hasAnyBroken ? 'fail' : 'done';
                        this.isComplete = true;
                        this.emitEvent(eventName, [this]);
                        this.emitEvent('always', [this]);
                        if (this.jqDeferred) {
                            var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
                            this.jqDeferred[jqMethod](this);
                        }
                    };

                    // --------------------------  -------------------------- //

                    function LoadingImage(img) {
                        this.img = img;
                    }

                    LoadingImage.prototype = Object.create(EvEmitter.prototype);

                    LoadingImage.prototype.check = function() {
                        // If complete is true and browser supports natural sizes,
                        // try to check for image status manually.
                        var isComplete = this.getIsImageComplete();
                        if (isComplete) {
                            // report based on naturalWidth
                            this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
                            return;
                        }

                        // If none of the checks above matched, simulate loading on detached element.
                        this.proxyImage = new Image();
                        this.proxyImage.addEventListener('load', this);
                        this.proxyImage.addEventListener('error', this);
                        // bind to image as well for Firefox. #191
                        this.img.addEventListener('load', this);
                        this.img.addEventListener('error', this);
                        this.proxyImage.src = this.img.src;
                    };

                    LoadingImage.prototype.getIsImageComplete = function() {
                        // check for non-zero, non-undefined naturalWidth
                        // fixes Safari+InfiniteScroll+Masonry bug infinite-scroll#671
                        return this.img.complete && this.img.naturalWidth;
                    };

                    LoadingImage.prototype.confirm = function(isLoaded, message) {
                        this.isLoaded = isLoaded;
                        this.emitEvent('progress', [this, this.img, message]);
                    };

                    // ----- events ----- //

                    // trigger specified handler for event type
                    LoadingImage.prototype.handleEvent = function(event) {
                        var method = 'on' + event.type;
                        if (this[method]) {
                            this[method](event);
                        }
                    };

                    LoadingImage.prototype.onload = function() {
                        this.confirm(true, 'onload');
                        this.unbindEvents();
                    };

                    LoadingImage.prototype.onerror = function() {
                        this.confirm(false, 'onerror');
                        this.unbindEvents();
                    };

                    LoadingImage.prototype.unbindEvents = function() {
                        this.proxyImage.removeEventListener('load', this);
                        this.proxyImage.removeEventListener('error', this);
                        this.img.removeEventListener('load', this);
                        this.img.removeEventListener('error', this);
                    };

                    // -------------------------- Background -------------------------- //

                    function Background(url, element) {
                        this.url = url;
                        this.element = element;
                        this.img = new Image();
                    }

                    // inherit LoadingImage prototype
                    Background.prototype = Object.create(LoadingImage.prototype);

                    Background.prototype.check = function() {
                        this.img.addEventListener('load', this);
                        this.img.addEventListener('error', this);
                        this.img.src = this.url;
                        // check if image is already complete
                        var isComplete = this.getIsImageComplete();
                        if (isComplete) {
                            this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
                            this.unbindEvents();
                        }
                    };

                    Background.prototype.unbindEvents = function() {
                        this.img.removeEventListener('load', this);
                        this.img.removeEventListener('error', this);
                    };

                    Background.prototype.confirm = function(isLoaded, message) {
                        this.isLoaded = isLoaded;
                        this.emitEvent('progress', [this, this.element, message]);
                    };

                    // -------------------------- jQuery -------------------------- //

                    ImagesLoaded.makeJQueryPlugin = function(jQuery) {
                        jQuery = jQuery || window.jQuery;
                        if (!jQuery) {
                            return;
                        }
                        // set local variable
                        $ = jQuery;
                        // $().imagesLoaded()
                        $.fn.imagesLoaded = function(options, callback) {
                            var instance = new ImagesLoaded(this, options, callback);
                            return instance.jqDeferred.promise($(this));
                        };
                    };
                    // try making plugin
                    ImagesLoaded.makeJQueryPlugin();

                    // --------------------------  -------------------------- //

                    return ImagesLoaded;
                });

            /***/
        }),

    /***/
    338:
        /***/
        (function(module, exports, __webpack_require__) {

            var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
            'use strict';

            var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
            };

            /**
             * EvEmitter v1.1.0
             * Lil' event emitter
             * MIT License
             */

            /* jshint unused: true, undef: true, strict: true */

            (function(global, factory) {
                // universal module definition
                /* jshint strict: false */
                /* globals define, module, window */
                if (true) {
                    // AMD - RequireJS
                    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                } else if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) == 'object' && module.exports) {
                    // CommonJS - Browserify, Webpack
                    module.exports = factory();
                } else {
                    // Browser globals
                    global.EvEmitter = factory();
                }
            })(typeof window != 'undefined' ? window : undefined, function() {

                "use strict";

                function EvEmitter() {}

                var proto = EvEmitter.prototype;

                proto.on = function(eventName, listener) {
                    if (!eventName || !listener) {
                        return;
                    }
                    // set events hash
                    var events = this._events = this._events || {};
                    // set listeners array
                    var listeners = events[eventName] = events[eventName] || [];
                    // only add once
                    if (listeners.indexOf(listener) == -1) {
                        listeners.push(listener);
                    }

                    return this;
                };

                proto.once = function(eventName, listener) {
                    if (!eventName || !listener) {
                        return;
                    }
                    // add event
                    this.on(eventName, listener);
                    // set once flag
                    // set onceEvents hash
                    var onceEvents = this._onceEvents = this._onceEvents || {};
                    // set onceListeners object
                    var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
                    // set flag
                    onceListeners[listener] = true;

                    return this;
                };

                proto.off = function(eventName, listener) {
                    var listeners = this._events && this._events[eventName];
                    if (!listeners || !listeners.length) {
                        return;
                    }
                    var index = listeners.indexOf(listener);
                    if (index != -1) {
                        listeners.splice(index, 1);
                    }

                    return this;
                };

                proto.emitEvent = function(eventName, args) {
                    var listeners = this._events && this._events[eventName];
                    if (!listeners || !listeners.length) {
                        return;
                    }
                    // copy over to avoid interference if .off() in listener
                    listeners = listeners.slice(0);
                    args = args || [];
                    // once stuff
                    var onceListeners = this._onceEvents && this._onceEvents[eventName];

                    for (var i = 0; i < listeners.length; i++) {
                        var listener = listeners[i];
                        var isOnce = onceListeners && onceListeners[listener];
                        if (isOnce) {
                            // remove listener
                            // remove before trigger to prevent recursion
                            this.off(eventName, listener);
                            // unset once flag
                            delete onceListeners[listener];
                        }
                        // trigger listener
                        listener.apply(this, args);
                    }

                    return this;
                };

                proto.allOff = function() {
                    delete this._events;
                    delete this._onceEvents;
                };

                return EvEmitter;
            });

            /***/
        }),

    /***/
    339:
        /***/
        (function(module, exports) {

            "use strict";

            $(function() {
                String.prototype.decodeHTML = function() {
                    return $("<div>", {
                        html: "" + this
                    }).html();
                };

                var $main = $(".lightbox");
                var init = function init() {
                    loadImages();
                    createGallery($main);
                    $('.archive-close', $main).on('click', function(e) {
                        e.preventDefault();
                        history.back();
                        $('body').removeClass('show--text');
                        $(document.body).removeClass('lightbox-open');
                        $main.html('').removeClass('lightbox--visible');
                    });
                };

                var ajaxLoad = function ajaxLoad(html) {
                    document.title = html.match(/<title>(.*?)<\/title>/)[1].trim().decodeHTML();
                    init();
                };

                var loadPage = function loadPage(href) {
                    $main.html('').addClass('lightbox--visible').load(href + " main", ajaxLoad);
                };

                $(window).on("popstate", function(e) {
                    if (e.originalEvent.state !== null) {
                        loadPage(location.href);
                    }
                });

                $(document).on("click", "a[data-ajax]", function() {
                    var href = $(this).attr("href");
                    if (href.indexOf(document.domain) > -1 || href.indexOf(':') === -1) {
                        history.pushState({}, '', href);
                        loadPage(href);
                        return false;
                    }
                });
            });

            /***/
        }),

    /***/
    340:
        /***/
        (function(module, exports) {

            'use strict';

            $(document).ready(function() {

                $('.images').on('click', function(event) {
                    event.preventDefault();
                    var i = $(this).data('i') || 0;
                    i++;
                    var count = $(this).find('figure').length;
                    $(this).find('figure').hide().eq(i % count).show();
                    $(this).data('i', i);
                    $(this).find('.price-details').find('.fig-nos-update').html(i % count + 1);
                });
            });

            /***/
        })

});