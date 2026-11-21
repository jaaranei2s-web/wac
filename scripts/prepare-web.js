// Prepares ./www for Android: viewport, safe-area CSS, compat JS. Non-destructive & idempotent.
const fs = require('fs');
const path = require('path');

const www = path.join(__dirname, '..', 'www');
const indexPath = path.join(www, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('\n[ERROR] www/index.html not found.\n' +
    'Copy your WAC Manager build/output files into the "www" folder (index.html must be at www/index.html).\n');
  process.exit(1);
}

fs.copyFileSync(path.join(__dirname, 'android-compat.js'), path.join(www, 'android-compat.js'));
fs.copyFileSync(path.join(__dirname, 'android-compat.css'), path.join(www, 'android-compat.css'));

let html = fs.readFileSync(indexPath, 'utf8');
const viewport = '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">';

if (/<meta[^>]+name=["']viewport["'][^>]*>/i.test(html)) {
  html = html.replace(/<meta[^>]+name=["']viewport["'][^>]*>/i, viewport);
} else {
  html = html.replace(/<head[^>]*>/i, (m) => m + '\n  ' + viewport);
}

if (!html.includes('android-compat.css')) {
  html = html.replace(/<\/head>/i, '  <link rel="stylesheet" href="android-compat.css">\n</head>');
}
if (!html.includes('android-compat.js')) {
  html = html.replace(/<\/body>/i, '  <script src="android-compat.js"></script>\n</body>');
}
fs.writeFileSync(indexPath, html);

// Heads-up checks
const warn = [];
if (/<script[^>]+src=["']https?:\/\/[^"']*(unpkg|cdnjs|jsdelivr|googleapis)[^"']*["']/i.test(html))
  warn.push('index.html loads libraries from a CDN: the app will need internet for those. Bundling them into www/ makes it fully offline.');
if (/navigator\.serviceWorker/.test(html)) warn.push('Service worker detected; it works in the app but is not needed.');
warn.forEach((w) => console.warn('[WARN] ' + w));
console.log('[OK] www/ prepared for Android.');
