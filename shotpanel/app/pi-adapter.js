/* =========================================================================
   SoulSync — pi-adapter.js
   One small layer that behaves the same everywhere:
     • In Pi Browser (window.Pi exists)  → real Pi.authenticate / Pi.createPayment
     • In any normal browser             → an honest demo simulation
       (index.html loads the Pi SDK in every browser, so a plain Chrome tab
        also ends up with window.Pi; the SDK alone no longer proves a Pi host —
        see piHostSignals() below — and `?pi=1` on the URL forces a real Pi
        session on a Pi Browser build whose signs we do not recognise.)
     • In Pi Browser without a working approval server (static hosting such as
       GitHub Pages, where POST /api/pi/approve answers 404/405) the adapter
       never opens a broken payment sheet: it checks the backend first and, when
       there is none, records the offering as a demo (`mode: "demo"`, no coins
       move). Nothing here fakes a blockchain transaction.

   `CONFIG.demoFallback` turns that last part off for a deployment that always
   has an approval server. With it on (the default), a payment only goes to
   Pi.createPayment after POST <approve endpoint> has actually answered like an
   API — so a static page can never produce a 405 error in the middle of a
   payment.
   ========================================================================= */
(function (root) {
  "use strict";

  var CONFIG = {
    // Pi SDK version required by the Pi Browser SDK.
    version: "2.0",
    // Keep sandbox=false for production payments (mainnet). Set true while testing.
    sandbox: false,
    // Your backend that approves/completes payments (see README).
    apiBase: "", // "" = same origin
    endpoints: {
      approve: "/api/pi/approve",
      complete: "/api/pi/complete",
      incomplete: "/api/pi/incomplete"
    },
    // Wallet/app memo shown in the Pi payment sheet.
    memoPrefix: "SoulSync gratitude offering",
    // Only fetched inside Pi Browser when the SDK was not injected by the shell.
    sdkUrl: "https://sdk.minepi.com/pi-sdk.js",

    /* --- static-hosting safety (no approval server) -----------------------
       true  : if the approve endpoint is missing (404/405) or unreachable,
               run the offering as a clearly-labelled demo instead of failing.
       false : always expect a real backend (Pi.createPayment then needs it).
       Set false only when every deployment of this app has the server. */
    demoFallback: true,
    // How long the capability check / approve call may take before we treat
    // the backend as unavailable (ms).
    requestTimeoutMs: 6000,
    // How long Pi.authenticate may take before the session continues in demo.
    // 12s, not 30s: a Pi Browser that does not answer must not leave the
    // connect button spinning.
    authTimeoutMs: 12000,
    // How long to wait for the async Pi SDK script before giving up on it.
    sdkWatchMs: 8000
  };

  // Statuses a static host (or a router with no such route) answers with.
  var MISSING_STATUS = [404, 405, 501];

  function hasPiSdk() {
    return typeof root.Pi !== "undefined" &&
      typeof root.Pi.authenticate === "function" &&
      typeof root.Pi.createPayment === "function";
  }

  /* --- which host is this page in? -------------------------------------
     Pi Browser is the only host that can answer the SDK, and it leaves its own
     signs on the page. They matter because index.html now loads the Pi SDK in
     every browser: SDK presence alone would turn a desktop visitor into a
     "Pi Browser" (12s sign-in waits, payment sheets that cannot open), while
     the app promises an instant, honest demo everywhere else. Any one sign is
     enough; `?pi=1` is the manual override for a Pi Browser build we cannot
     recognise. */
  function piHostSignals() {
    var signals = { userAgent: false, injected: false, framed: false, referrer: false, forced: false };
    var nav = root.navigator || {};
    signals.userAgent = /PiBrowser/i.test(nav.userAgent || "");
    // The host injected its own SDK before our scripts ran (see index.html).
    signals.injected = !!root.__SS_PI_INJECTED;
    try { signals.framed = !!root.parent && root.parent !== root; } catch (e) { signals.framed = false; }
    var referrer = "";
    try { referrer = (root.document && root.document.referrer) || ""; } catch (e) { referrer = ""; }
    signals.referrer = /minepi\.com|pinet\.com|piappengine\.com/i.test(referrer);
    var search = "";
    try { search = (root.location && root.location.search) || ""; } catch (e) { search = ""; }
    signals.forced = /[?&]pi=1(&|$)/.test(search);
    return signals;
  }

  function isPiHost() {
    var s = piHostSignals();
    return !!(s.userAgent || s.injected || s.framed || s.referrer || s.forced);
  }

  function endpointUrl(name) {
    return CONFIG.apiBase + CONFIG.endpoints[name];
  }

  function isMissingStatus(status) {
    return MISSING_STATUS.indexOf(status) !== -1;
  }

  function httpError(code, status) {
    var err = new Error(code);
    err.code = code;
    err.status = status || 0;
    return err;
  }

  /**
   * One JSON POST that never throws.
   * @returns {Promise<{status:number, ok:boolean, isJson:boolean, data:*, kind:string}>}
   *   kind: "live"    — an API answered (2xx, or a JSON error status)
   *         "error"   — an answer we cannot read as an API (non-JSON error page)
   *         "missing" — 404/405/501, or a static HTML page instead of an API
   *         "network" — offline, CORS, timeout, no fetch
   */
  function sendJSON(url, body, timeoutMs) {
    if (typeof root.fetch !== "function") {
      return Promise.resolve({ status: 0, ok: false, isJson: false, data: null, kind: "network" });
    }
    var controller = typeof root.AbortController === "function" ? new root.AbortController() : null;
    var timer = setTimeout(function () {
      if (!controller) return;
      try { controller.abort(); } catch (e) { /* ignore */ }
    }, timeoutMs || CONFIG.requestTimeoutMs);

    var init = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {}),
      cache: "no-store"
    };
    if (controller) init.signal = controller.signal;

    return root.fetch(url, init).then(function (res) {
      clearTimeout(timer);
      var ct = "";
      try { ct = (res.headers && res.headers.get && res.headers.get("content-type")) || ""; } catch (e) { /* ignore */ }
      var isJson = /json/i.test(ct);
      return res.json().catch(function () { return null; }).then(function (data) {
        return {
          status: res.status,
          ok: !!res.ok,
          isJson: isJson,
          data: data,
          kind: classify(res.status, res.ok, ct)
        };
      });
    }).catch(function () {
      clearTimeout(timer);
      return { status: 0, ok: false, isJson: false, data: null, kind: "network" };
    });
  }

  function classify(status, ok, contentType) {
    if (!status) return "network";
    if (isMissingStatus(status)) return "missing";
    // A static host can answer POST with its own page (200 + text/html).
    if (ok && /html/i.test(contentType)) return "missing";
    if (ok || /json/i.test(contentType)) return "live";
    return "error";
  }

  var adapter = {
    mode: "demo",           // "pi" | "demo"          (sign-in + overall behaviour)
    paymentMode: "demo",    // "pi" | "demo"          (whether Pi.createPayment is used)
    backend: "unknown",     // "unknown" | "live" | "missing"
    backendDetail: null,    // why: "live" | "missing" (404/405/HTML) | "network" | "error"
    notice: null,           // "no_backend" | "demo_auth" | "sdk_error" | null
    authError: null,
    config: CONFIG,
    user: null,
    initialized: false,

    isPiBrowser: function () { return hasPiSdk() && isPiHost(); },

    /** Detect the environment once at start-up.
     *  @param {Function} [onChange] called if the SDK or payment capability becomes available later.
     */
    init: function (onChange) {
      this._onChange = typeof onChange === "function" ? onChange : null;
      if (hasPiSdk()) {
        if (isPiHost()) this._enablePi();
        else this._stayDemoOnForeignHost();
        return this.mode;
      }
      this.mode = "demo";
      this.paymentMode = "demo";
      this.initialized = true;
      // index.html loads the SDK asynchronously; it can arrive a moment later.
      this._awaitSdk();
      return this.mode;
    },

    /** SDK present, but this page is not a Pi host (a plain browser loaded it). */
    _stayDemoOnForeignHost: function () {
      this.mode = "demo";
      this.paymentMode = "demo";
      this.notice = this.notice || "no_host";
      this.initialized = true;
      if (this._onChange) this._onChange(this.mode);
      return this.mode;
    },

    /**
     * Wait (briefly) for the async SDK script. It is added by index.html; a
     * page without the tag gets one only when the host is recognisably Pi
     * Browser, so a plain browser never fetches it twice.
     */
    _awaitSdk: function () {
      var self = this;
      if (self._sdkWatch) return;
      var doc = root.document;
      if (!doc || typeof setInterval !== "function") return;
      var tagged = false;
      try { tagged = !!(doc.querySelector && doc.querySelector('script[src*="pi-sdk.js"]')); } catch (e) { tagged = false; }
      if (!tagged && isPiHost()) self._loadSdk();

      var waited = 0;
      var timer = setInterval(function () {
        if (hasPiSdk()) {
          clearInterval(timer);
          self._sdkWatch = null;
          if (isPiHost()) self._enablePi();
          else self._stayDemoOnForeignHost();
          return;
        }
        waited += 150;
        if (waited >= CONFIG.sdkWatchMs) {
          clearInterval(timer);
          self._sdkWatch = null;
        }
      }, 150);
      // Node (the test harness) would otherwise stay alive for the whole wait.
      if (timer && typeof timer.unref === "function") timer.unref();
      self._sdkWatch = timer;
    },

    _enablePi: function () {
      if (this.mode === "pi") return this.mode;
      try {
        var started = root.Pi.init({ version: CONFIG.version, sandbox: CONFIG.sandbox });
        // A newer SDK returns a promise; a rejection (host not answering) must
        // not become an unhandled one.
        if (started && typeof started.then === "function") started.then(null, function () {});
        this.mode = "pi";
        this.paymentMode = "pi";
      } catch (err) {
        this.mode = "demo";
        this.paymentMode = "demo";
      }
      this.initialized = true;
      if (this._onChange) this._onChange(this.mode);
      // Ask the approve endpoint — before any payment — whether a real backend
      // is there. On static hosting this answers 404/405 and payments turn into
      // the demo path; no payment sheet is ever opened against a dead endpoint.
      if (this.mode === "pi") this.checkBackend();
      return this.mode;
    },

    /** Inject the SDK once (only used when the page did not include the tag). */
    _loadSdk: function () {
      var self = this;
      if (!root.document || self._loading) return;
      self._loading = true;
      var s = root.document.createElement("script");
      s.src = CONFIG.sdkUrl;
      s.async = true;
      s.onload = function () { self._loading = false; };
      s.onerror = function () { self._loading = false; };
      root.document.head.appendChild(s);
    },

    /** Turn payments (and, for an unusable Pi session, the whole layer) into demo. */
    _fallbackToDemo: function (notice) {
      this.mode = "demo";
      this.paymentMode = "demo";
      this.notice = notice || this.notice;
      if (this._onChange) this._onChange(this.mode);
    },

    _setPaymentMode: function (mode, notice) {
      var changed = this.paymentMode !== mode || (notice && this.notice !== notice);
      this.paymentMode = mode;
      if (notice) this.notice = notice;
      if (changed && this._onChange) this._onChange(this.mode);
    },

    /**
     * Is a usable approval backend present? Cached for the session; the answer
     * is a POST to the approve endpoint with a harmless capability body (no
     * paymentId), because only a POST can tell a real route from a static 405.
     * @returns {Promise<"live"|"missing">}
     */
    checkBackend: function (force) {
      var self = this;
      if (!CONFIG.demoFallback) {
        self.backend = "live";
        return Promise.resolve("live");
      }
      if (self._backendPromise && !force) return self._backendPromise;
      self._backendPromise = sendJSON(endpointUrl("approve"), { probe: "soulsync-capability-check" })
        .then(function (res) {
          var live = res.kind === "live";
          self.backend = live ? "live" : "missing";
          self.backendDetail = res.kind;
          if (self.mode === "pi") {
            if (live) {
              // A later check found the server: go back to real payments.
              var back = self.paymentMode !== "pi";
              self.paymentMode = "pi";
              self.notice = null;
              if (back && self._onChange) self._onChange(self.mode);
            } else {
              self._setPaymentMode("demo", "no_backend");
            }
          }
          return self.backend;
        });
      return self._backendPromise;
    },

    ensurePaymentBackend: function () {
      var self = this;
      if (!CONFIG.demoFallback) return Promise.resolve(true);
      if (self.backend === "live") return Promise.resolve(true);
      if (self.backend === "missing") {
        // A 404/405 is final. A network/CORS failure may have been a blip, so
        // give the server one more chance when the user actually offers.
        if (self.backendDetail === "missing" || self.backendDetail === "live") {
          return Promise.resolve(false);
        }
        return self.checkBackend(true).then(function (state) { return state === "live"; });
      }
      return self.checkBackend().then(function (state) { return state === "live"; });
    },

    /** Handle a payment that was interrupted earlier (Pi SDK requirement). */
    onIncompletePaymentFound: function (payment) {
      var id = payment && payment.identifier;
      if (!id) return;
      // Fire and forget: a missing backend must not break start-up.
      sendJSON(endpointUrl("incomplete"), { paymentId: id });
    },

    _demoUser: function (reason) {
      var user = {
        uid: "demo-uid-" + Date.now().toString(36),
        username: "demo_pioneer",
        mode: "demo"
      };
      if (reason) {
        user.fallback = true;
        user.reason = reason;
      }
      this.user = user;
      return user;
    },

    _demoAuthenticate: function (reason) {
      var self = this;
      return new Promise(function (resolve) {
        setTimeout(function () { resolve(self._demoUser(reason)); }, 650);
      });
    },

    /**
     * Sign in.
     * Pi Browser: real Pi.authenticate; if the Pi session cannot start (domain
     * not registered in the Pi Developer Portal, user dismissed, offline) the
     * app continues with a demo pioneer instead of stopping.
     * @returns {Promise<{uid:string, username:string, mode:string, accessToken?:string, fallback?:boolean}>}
     */
    authenticate: function () {
      var self = this;
      if (self.mode !== "pi" || !hasPiSdk()) return self._demoAuthenticate(null);

      return new Promise(function (resolve) {
        var settled = false;
        var timer = setTimeout(function () {
          if (settled) return;
          settled = true;
          self.authError = "timeout";
          self._fallbackToDemo("demo_auth");
          self._demoAuthenticate("auth_timeout").then(resolve);
        }, CONFIG.authTimeoutMs);

        function done(user) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          self.user = user;
          resolve(user);
        }
        function fallBack(reason) {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          self.authError = reason;
          self._fallbackToDemo("demo_auth");
          self._demoAuthenticate("auth_unavailable").then(resolve);
        }

        try {
          var attempt = root.Pi.authenticate(["username", "payments"], function (payment) {
            self.onIncompletePaymentFound(payment);
          });
          if (!attempt || typeof attempt.then !== "function") {
            fallBack("no_promise");
            return;
          }
          attempt.then(function (auth) {
            var user = (auth && auth.user) || {};
            if (!user.uid && !user.username) {
              fallBack("empty_auth");
              return;
            }
            done({
              uid: user.uid || "",
              username: user.username || "pioneer",
              mode: "pi",
              accessToken: auth && auth.accessToken
            });
          }, function (err) {
            fallBack((err && (err.message || String(err))) || "auth_rejected");
          });
        } catch (err) {
          fallBack(err && (err.message || String(err)));
        }
      });
    },

    /** Demo offering — clearly marked, nothing is charged. */
    _demoPay: function (amount, memo, reason) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve({
            identifier: "demo-pay-" + Date.now().toString(36),
            txid: null,
            amount: amount,
            memo: memo,
            mode: "demo",
            simulated: true,
            reason: reason || null
          });
        }, 900);
      });
    },

    /** Real Pi payment. Only called once the approval backend has answered. */
    _piPay: function (amount, userMemo, paymentMemo) {
      var self = this;
      return new Promise(function (resolve, reject) {
        var paymentData = {
          amount: amount,
          memo: paymentMemo,
          metadata: { app: "soulsync", kind: "gratitude", note: userMemo, ts: Date.now() }
        };
        var callbacks = {
          // 1) ask our backend to approve the payment with the Pi API
          onReadyForServerApproval: function (paymentId) {
            sendJSON(endpointUrl("approve"), { paymentId: paymentId }).then(function (res) {
              if (res.kind === "missing") {
                // The backend vanished between the check and the payment.
                self._setPaymentMode("demo", "no_backend");
                reject(httpError("backend_missing", res.status));
                return;
              }
              if (res.kind !== "live" || (res.data && res.data.ok === false)) {
                reject(httpError("approve_failed", res.status));
              }
            });
          },
          // 2) after the user signs in Pi, complete it server-side
          onReadyForServerCompletion: function (paymentId, txid) {
            sendJSON(endpointUrl("complete"), { paymentId: paymentId, txid: txid }).then(function (res) {
              if (res.kind !== "live" || (res.data && res.data.ok === false)) {
                reject(httpError("complete_failed", res.status));
                return;
              }
              resolve({
                identifier: paymentId,
                txid: txid,
                amount: amount,
                memo: userMemo,
                mode: "pi"
              });
            });
          },
          onCancel: function (paymentId) { reject(httpError("cancelled:" + paymentId)); },
          onError: function (error, payment) {
            reject(httpError("payment_error:" + (payment && payment.identifier)));
          }
        };
        try {
          root.Pi.createPayment(paymentData, callbacks);
        } catch (err) {
          // createPayment never started, so no payment sheet is open: the
          // offering can still be recorded as a demo.
          self._setPaymentMode("demo", "sdk_error");
          self._demoPay(amount, userMemo, "sdk_error").then(resolve, reject);
        }
      });
    },

    /**
     * Pay a small gratitude offering.
     * @param {{amount:number, memo:string, metadata?:object}} opts
     * @returns {Promise<{identifier:string, txid?:string, amount:number, memo:string, mode:string}>}
     */
    pay: function (opts) {
      var self = this;
      var amount = Number(opts && opts.amount);
      var userMemo = (opts && opts.memo) || "";
      var paymentMemo = CONFIG.memoPrefix + (userMemo ? " · " + userMemo : "");
      if (!isFinite(amount) || amount <= 0) {
        return Promise.reject(new Error("invalid_amount"));
      }

      if (self.mode !== "pi" || !hasPiSdk()) return self._demoPay(amount, userMemo, null);

      return self.ensurePaymentBackend().then(function (live) {
        if (!live) {
          self._setPaymentMode("demo", "no_backend");
          return self._demoPay(amount, userMemo, "no_backend");
        }
        return self._piPay(amount, userMemo, paymentMemo);
      });
    },

    reset: function () {
      this.user = null;
      this.authError = null;
    }
  };

  root.SS_PI = adapter;
  if (typeof module !== "undefined" && module.exports) module.exports = adapter;
})(typeof window !== "undefined" ? window : globalThis);
