/* WAC Manager - Android WebView compatibility layer.
   Loaded automatically into www/index.html by scripts/prepare-web.js. */
(function () {
  'use strict';
  var Cap = window.Capacitor;
  var isNative = !!(Cap && Cap.isNativePlatform && Cap.isNativePlatform());
  if (!isNative) return; // does nothing in a normal browser

  document.documentElement.classList.add('is-android-app');

  // 1. Ask Android to keep localStorage/IndexedDB (don't evict under storage pressure)
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

  // 2. Hardware / gesture BACK button: go back in history, exit only at the root
  try {
    var App = Cap.Plugins && Cap.Plugins.App;
    if (App && App.addListener) {
      App.addListener('backButton', function (ev) {
        // close any open modal first, if the site marks them in a common way
        var modal = document.querySelector('.modal.show, .modal.open, [role="dialog"][open], dialog[open]');
        if (modal) {
          var closeBtn = modal.querySelector('[data-dismiss], [data-bs-dismiss], .close, .modal-close, button[aria-label="Close"]');
          if (closeBtn) { closeBtn.click(); return; }
        }
        if (ev && ev.canGoBack) { window.history.back(); }
        else if (window.history.length > 1 && location.hash && location.hash !== '#/' && location.hash !== '#') { window.history.back(); }
        else { App.exitApp(); }
      });
    }
  } catch (e) { console.warn('[WAC] back button setup failed', e); }

  // 3. Open external http(s) links in the system browser (keeps the app on its own pages)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/^(tel:|mailto:|sms:|whatsapp:)/i.test(href)) return; // let Android handle
    if (/^https?:\/\//i.test(href) && a.hostname !== location.hostname) {
      e.preventDefault();
      window.open(href, '_system');
    }
  }, true);

  // 4. Block pinch-zoom / double-tap zoom like a native app
  document.addEventListener('gesturestart', function (e) { e.preventDefault(); });
})();
