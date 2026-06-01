import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.1ceb3eb8d3034932b66e9669230597dc',
  appName: 'Foliogen',
  webDir: 'dist',
  // Live server URL — every web update on foliogen.in propagates instantly
  // to the installed Play Store app (no APK re-upload required for content).
  server: {
    url: 'https://foliogen.in',
    cleartext: true,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
