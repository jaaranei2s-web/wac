// WAC Manager - Capacitor config
// Default: the app is BUNDLED inside the APK (works offline, uses ./www).
// Optional: set CAP_SERVER_URL to load the live site instead (needs internet).
const liveUrl = process.env.CAP_SERVER_URL || '';

/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: 'com.wac.manager',
  appName: 'WAC Manager',
  webDir: 'www',
  backgroundColor: '#0F172A',
  server: {
    // https scheme => localStorage / IndexedDB / cookies / fetch() to https APIs
    // behave exactly like on a real website (no mixed-content blocking).
    androidScheme: 'https',
    cleartext: false,
    ...(liveUrl ? { url: liveUrl } : {}),
  },
  android: {
    allowMixedContent: false,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      launchAutoHide: true,
      launchFadeOutDuration: 250,
      backgroundColor: '#0F172A',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F172A',
      overlaysWebView: false,
    },
  },
};

module.exports = config;
