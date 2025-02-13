
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.82e0953570324373bf6de8d47d9c7a76',
  appName: 'tewsilty',
  webDir: 'dist',
  server: {
    url: 'https://82e09535-7032-4373-bf6d-e8d47d9c7a76.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    contentInset: 'always'
  }
};

export default config;
