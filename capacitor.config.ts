import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "bf.parfaitdesign.desmohair",
  appName: "Parfait.Design/Desmohair",
  webDir: "dist/client",
  backgroundColor: "#ffffff",
  android: {
    allowMixedContent: false,
    captureInput: true,
    hideNavigationBar: false,
    statusBarBackgroundColor: "#ffffff",
    statusBarStyle: "dark",
    windowSoftInputMode: "adjustResize",
    launchAutoHide: true,
    splashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
  },
  ios: {
    contentInset: "always",
    scrollsToTop: true,
  },
  server: {
    androidScheme: "https",
    iosScheme: "https",
  },
  plugins: {
    StatusBar: {
      style: "light",
      backgroundColor: "#ffffff",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#ffffff",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    App: {
      urlHandlers: [],
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
    LocalNotifications: {
      defaultChannel: "parfait-notifications",
      android: {
        foregroundService: {
          notificationPriority: 5,
        },
      },
    },
  },
};

export default config;