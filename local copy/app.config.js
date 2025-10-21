export default {
  expo: {
    name: "SLT Business Date Calculator",
    slug: "slt-business-date-calculator",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    orientation: "portrait",
    platforms: ["ios", "android", "web"],
    web: {
      bundler: "metro",
      routerRoot: ".",  // <— force Expo to use the project root
      favicon: "./assets/favicon.png"
    }
  }
};