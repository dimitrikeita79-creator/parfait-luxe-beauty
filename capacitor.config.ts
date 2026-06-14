import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "bf.parfaitdesign.desmohair",
  appName: "Parfait.Design/Desmohair",
  webDir: "dist",
  backgroundColor: "#ffffff",
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;