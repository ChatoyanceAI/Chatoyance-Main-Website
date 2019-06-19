(function() {

    var VERSION = '2.1.03';

    var logger = [];
    var installed = false;


    // Add getElementsByClassName
    if (!document.getElementsByClassName) {
        document.getElementsByClassName = function(search) {
            var d = document, elements, pattern, i, results = [];
            if (d.querySelectorAll) { // IE8
                return d.querySelectorAll("." + search);
            }
            if (d.evaluate) { // IE6, IE7
                pattern = ".//*[contains(concat(' ', @class, ' '), ' " + search + " ')]";
                elements = d.evaluate(pattern, d, null, 0, null);
                while ((i = elements.iterateNext())) {
                    results.push(i);
                }
            } else {
                elements = d.getElementsByTagName("*");
                pattern = new RegExp("(^|\\s)" + search + "(\\s|$)");
                for (i = 0; i < elements.length; i++) {
                    if ( pattern.test(elements[i].className) ) {
                        results.push(elements[i]);
                    }
                }
            }
            return results;
        };
    }

    var onReady = function(callback) {

        var DOMContentLoaded = null;

        if ( document.addEventListener ) {
            DOMContentLoaded = function() {
                document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
                callback();
            };

        } else if ( document.attachEvent ) {
            DOMContentLoaded = function() {
                // Make sure body exists, at least, in case IE gets a little overzealous
                if ( document.readyState === "complete" ) {
                    callback();
                }
            };
        }

        if ( document.readyState === "complete" ) {
            // Handle it asynchronously to allow scripts the opportunity to delay ready
            setTimeout( callback, 1 );
        }

        if ( document.addEventListener ) {

            document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
            // A fallback to window.onload, that will always work
            //window.addEventListener( "load", jQuery.ready, false );
            window.addEventListener( "load", callback, false );

        } else if ( document.attachEvent ) {    // If IE event model is used
            // ensure firing before onload,
            document.attachEvent("onreadystatechange", DOMContentLoaded);

            // A fallback to window.onload, that will always work
            window.attachEvent( "onload", callback );
        }
    };

    var errReport = function(err, context) {
        var pxl = new Image();
        pxl.width = pxl.height = 1;
        pxl.style.position = 'absolute';
        pxl.style.visibility = 'hidden';
        document.body.appendChild(pxl);

        var report = [], er;
        if (typeof err === 'object') {
            for (er in err) {
                report.push(er + '-' + err[er]);
            }
        } else {
            report.push(err);
        }

        pxl.src = (document.location.protocol === 'https:' ? 'https://' : 'http://') + 'koi.sharpspring.com/net/err/' + '?err=' + encodeURIComponent(report.join('--')) +
            '&log=' + encodeURIComponent(logger.join('--')) + '&context=' + encodeURIComponent(context) + '&ver=' + VERSION;
    };

    try {
        (function(client) {

            if (!client || installed) {
                return;
            }

            var ss_client = function(ss_queue) {

                var self = this,
                    account = null,
                    version = VERSION,
                    queue = ss_queue.concat(),
                    readyQueue = [],
                    history = [],
                    params = {},
                    api = {},
                    session = null;

                var App_Hostname = 'app.sharpspring.com';
                var Custom_App_Hostname = 'marketingautomation.services';

                var Cookie_Session_Name = '__ss';
                var Cookie_Session_Referrer = '__ss_referrer';
                var Cookie_Session_Campaign = '__ss_cp';
                var Cookie_Session_Tracking = '__ss_tk';

                var Session_Timeout = 24 * 60 * 60 * 1000;
                var Session_Page_Timeout = 60 * 60 * 1000;
                var Session_Tracking_Lifetime = 60 * 60 * 24 * 365 * 25 * 1000;
                var ENDPOINT_URL = 'https://koi.sharpspring.com/net';

                var url_parser = document.createElement('a');
                var documentHiddenVar = null;
                var isVisible = function() { return (!documentHiddenVar || !document[documentHiddenVar]); };
                var responses = [];
                var lastPageResponse = null;
                var responseCallback = null;
                var documentIsReady = false;

                logger.push('Variables Initialized');


                // ---------------------- Private ------------------------
                function run(args) {

                    if (!args || !args.concat) {
                        return;
                    }

                    var copy = args.concat();
                    var func = copy.shift();

                    try {
                        if (api[func]) {
                            logger.push('Call ' + func);
                            (api[func]).apply(self, copy);
                            history.push(['CALL', args]);
                        } else {
                            history.push(['ERROR', args]);
                        }
                    } catch (err) {
                        errReport(err, func);
                        if (console && typeof console.warn === 'function') {
                            console.warn('tracking failed', func);
                        }
                    }
                }



                function setCookie(key, value, options) {

                    if (value === null || value === undefined) {
                        options.expires = -1;
                    }

                    if (typeof options.expires === 'number') {
                        var millisecs = options.expires;
                        var now = (new Date()).getTime();
                        options.expires = (new Date(now + millisecs));
                    }

                    options.path = options.path || '/';

                    value = String(value);

                    document.cookie = [
                        escape(key), '=', options.raw ? value : escape(value),
                        options.expires > 0 ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                        options.path    ? '; path=' + options.path : '',
                        options.domain  ? '; domain=' + options.domain : '',
                        options.secure  ? '; secure' : ''
                    ].join('');

                    return document.cookie;
                }


                function getCookie(cookie_name) {

                    if (cookie_name) {
                        var results = document.cookie.match ( '(^|;) ?' + cookie_name + '=([^;]*)(;|$)' );

                        if ( results ) {
                            return ( unescape ( results[2] ) );
                        }

                        return null;

                    }

                    return document.cookie;
                }


                function setSession() {

                    params.se = getCookie(Cookie_Session_Name);
                    params.tk = getCookie(Cookie_Session_Tracking);

                    var lastPage = null;

                    if (!params.se) {

                        params.se = (new Date()).getTime();

                    } else if (!session) {

                        lastPage = getCookie(Cookie_Session_Referrer);
                        url_parser.href = document.referrer;

                        if (lastPage && lastPage.length) {
                            if (url_parser.hostname === App_Hostname || url_parser.hostname.split('.').slice(1).join('.') === Custom_App_Hostname) {
                                params.rf = lastPage;
                            }

                        } else if (!document.referrer.length || url_parser.hostname != location.hostname) {
                            params.se = (new Date()).getTime();
                        }

                    }

                    session = params.se; // needs to be false the first time so that it doesn't get reset when grabbing the cookie

                    setCookie(Cookie_Session_Name, session, {expires: Session_Timeout});
                    setCookie(Cookie_Session_Referrer, location.href, {expires: Session_Page_Timeout});
                    return session;
                }

                function runQueue() {
                    if (isVisible()) {
                        setSession();
                        while (queue.length > 0) {
                            run(queue.shift());
                        }
                    }
                }

                function onVisibleChange() {
                    runQueue();
                }

                function setDocHiddenListeners() {

                    var hidden = null;

                    // Standards:
                    if (document.hasOwnProperty("hidden")) {
                        hidden = "hidden";
                        document.addEventListener("visibilitychange", onVisibleChange);
                    } else if (document.hasOwnProperty("mozHidden")) {
                        hidden = "mozHidden";
                        document.addEventListener("mozvisibilitychange", onVisibleChange);
                    } else if (document.hasOwnProperty("webkitHidden")) {
                        hidden = "webkitHidden";
                        document.addEventListener("webkitvisibilitychange", onVisibleChange);
                    } else if (document.hasOwnProperty("msHidden")) {
                        hidden = "msHidden";
                        document.addEventListener("msvisibilitychange", onVisibleChange);
                    }

                    return hidden;
                }

                function insertPhoneNumbers(phoneNumber) {
                    if (!phoneNumber || !phoneNumber['display'] || !phoneNumber['e164']) {
                        return;
                    }

                    var phoneElements = document.getElementsByClassName('ss-phone');
                    var el, i;

                    for (i = 0; i < phoneElements.length; i++) {
                        el = phoneElements[i];

                        el.innerHTML = phoneNumber['display'];
                        if (el.nodeName === 'A') {
                            el.href = 'tel: +' + phoneNumber['e164'];
                        }
                    }
                }

                function runWhenReady(callback, args) {
                    if (!documentIsReady) {
                        readyQueue.push({f: callback, a: args});
                    } else if (typeof callback === 'function') {
                        callback.apply(window, args);
                    }
                }

                function wrapCallback(callback) {
                    if (typeof callback === 'function') {
                        return function() {
                            runWhenReady(callback, Array.prototype.slice.call(arguments));
                        };
                    }
                }


                // ---------------------- Public ------------------------

                this.push = function(args) {
                    if (isVisible()) {
                        run(args);
                    } else {
                        queue.push(args);
                    }
                };

                this.onReady = function() {
                    var o;
                    documentIsReady = true;

                    while (readyQueue.length > 0) {
                        o = readyQueue.shift();
                        if (typeof o.f === 'function') {
                            o.f.apply(window, o.a);
                        }
                    }
                };

                this.handleResponse = function(resp) {
                    responses.push(resp);

                    if (resp && resp.hasOwnProperty('type') && resp.type === 'page') {
                        lastPageResponse = resp;
                    }

                    if (resp && resp.hasOwnProperty('trackingID')) {
                        var tk = params.tk || resp.trackingID;
                        setCookie(Cookie_Session_Tracking, tk, {expires: Session_Tracking_Lifetime});

                        try {
                            var fEndpoint = ENDPOINT_URL.replace('.sharpspring.com/net', '.marketingautomation.services/net');
                            if (fEndpoint !== ENDPOINT_URL) {
                                var pxl = new Image();
                                pxl.width = pxl.height = 1;
                                pxl.style.position = 'absolute';
                                pxl.style.visibility = 'hidden';
                                document.body.appendChild(pxl);

                                pxl.src = fEndpoint + '/f/?tk=' + tk;
                            }
                        } catch (e) {
                            errReport(e, 'forwardTracking');
                        }
                    }

                    if (resp && resp.hasOwnProperty('phoneNumber')) {
                        insertPhoneNumbers(resp.phoneNumber);
                    }

                    if (typeof responseCallback === 'function') {
                        try { responseCallback(resp); } catch(ignore) {}
                    }

                };

                this.getVersion = function() {
                    return version;
                };

                this.getHistory = function() {
                    return history;
                };

                this.getResponseHistory = function () {
                    return responses;
                };

                this.getLastResponse = function () {
                    return lastPageResponse;
                };


                // ---------------------- Utils ------------------------
                function loadScript(queryStr, callback) {

                    var script = document.createElement('script');
                    var loaded = false;
                    script.src = (ENDPOINT_URL + '?' + queryStr);
                    script.onload = script.onreadystatechange = function(loadEvent){
                        if (!loaded && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                            script.parentNode.removeChild(script);
                            loaded = true;

                            if (typeof callback === 'function') {
                                callback();
                            }
                        }
                    };

                    document.getElementsByTagName('head')[0].appendChild(script);
                }


                function getParams(extras) {

                    setSession();
                    params.ts = (new Date().getTime()).toString();

                    var doc = document.documentElement;
                    var left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
                    var top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);

                    params.pt = top;
                    params.pl = left;

                    var p, getVars = [];
                    params.ts = Math.round((new Date().getTime() / 1000));

                    for (p in params) {
                        if (params[p]) {
                            getVars.push(encodeURIComponent(p) +'='+ encodeURIComponent(params[p]));
                        }
                    }

                    for (p in extras) {
                        getVars.push(encodeURIComponent(p) +'='+ encodeURIComponent(extras[p]));
                    }

                    return getVars.join('&');
                }


                function getScreenResolution() {
                    return window.screen.width + 'x' + window.screen.height;
                }


                // Logging
                api._setDomain = function(domain) {
                    ENDPOINT_URL = domain;
                };

                api._setAccount = function(accountNumber) {
                    account = accountNumber;
                    params.ac = account;
                };

                api._setResponseCallback = function(callback) {
                    responseCallback = wrapCallback(callback);
                };

                api._trackPageView = function(callback) {
                    var extras = {'tp': 'page', 'ti': document.title};

                    if (location.hash.length) {
                        extras.hs = location.hash;
                    }

                    var qstr = getParams(extras);
                    loadScript(qstr, wrapCallback(callback));
                };

                // --------------------- SHOPPING CART ---------------------

                api._setTransaction = function(transaction, callback) {
                    transaction['tp'] = 'setTransaction';
                    var qstr = getParams(transaction);
                    loadScript(qstr, wrapCallback(callback));
                };

                api._addTransactionItem = function(transactionItem, callback) {
                    transactionItem['tp'] = 'addTransactionItem';
                    var qstr = getParams(transactionItem);
                    loadScript(qstr, wrapCallback(callback));
                };

                api._completeTransaction = function(transaction, callback) {
                    transaction['tp'] = 'completeTransaction';
                    var qstr = getParams(transaction);
                    loadScript(qstr, wrapCallback(callback));
                };

                api._trackCampaign = function(campaignID, callback) {

                    setCookie(Cookie_Session_Campaign, campaignID, {expires: (90 * 24 * 60 * 60 * 1000)});

                    var extras = {'tp': 'tags', 'cp': campaignID};
                    var qstr = getParams(extras);
                    loadScript(qstr, wrapCallback(callback));
                };

                api._trackEvent = function(ev, callback) {

                    if (typeof ev === 'object') {

                        var event = {
                            'tp': 'event',
                            'ev': ev['event'] || null,
                            'tg': ev['tags'] || null,
                            'lb': ev['label'] || '',
                            'vl': ev['value'] || '',
                            'et': ev['eventTrigger'] || 'click',
                            'ta': ev['triggerAutomation'] || 1,
                            'uri': ev['uri'] || ''
                        };

                        if (event['ev'] && event['tg']) {
                            var qstr = getParams(event);
                            loadScript(qstr, wrapCallback(callback));
                        }

                    }

                };


                function init() {

                    params.rf = document.referrer;
                    params.hn = location.hostname;
                    params.lg = (navigator.userLanguage || navigator.language);
                    params.sr = getScreenResolution();
                    params.cd = screen.colorDepth;
                    params.vr = version;

                    documentHiddenVar = setDocHiddenListeners(); // only run the queue if the screen is visible

                    logger.push('Running queue');
                    runQueue();
                    logger.push('Queue finished');
                }

                init();
            };

            if (!installed) {
                _ss = (new ss_client(client));
                logger.push('Installed');
                installed = true;
            }

            // Tell Client about Document Ready
            onReady(function() {
                logger.push('Page ready');
                _ss.onReady();
            });

        } )(_ss);

    } catch (err) {

        onReady(function() {
            errReport(err, 'catchall');
        });
    }

})();
