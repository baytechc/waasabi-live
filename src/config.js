export default {
  WAASABI_BACKEND: (process.env.NODE_ENV==='production' ? "https://eurorust-2025.rustfest.family/api/v1" : "http://localhost:9000"),
  WAASABI_GRAPHQL_WS: (process.env.NODE_ENV==='production' ? "wss://eurorust-2025.rustfest.family/events" : "ws://localhost:9000/events"),

  WAASABI_SESSION_URL: "",

  WAASABI_CHAT_URL: "https://matrix.to/#/#eurorust:rustch.at",
  WAASABI_DISCORD_URL: "",

  WAASABI_CHAT_ENABLED: true,
  WAASABI_CHAT_SYSTEM: "matrix",
  WAASABI_CHAT_INVITES: false,
  WAASABI_CHAT_INFO: "",

  WAASABI_MATRIX_SERVER: "rustch.at",
  WAASABI_MATRIX_CLIENT_URL: "https://rustch.at",
  WAASABI_MATRIX_API_URL: "https://rustch.at",

  WAASABI_BRAND: "brand-eurorust25",
  WAASABI_EVENT_TITLE: "EuroRust 2025",

  // All WAASABI_* variables are exposed to frontend code via process.env.* using ESBuild

  BUILD_DIR: "_site",
  BUILD_COPY: {
    // TODO: globs
    // Copy VideoJS assets
    "node_modules/video.js/dist/video-js.min.css": "assets/videojs",
  },

  PREFIX: "",

  TITLE: "EuroRust 2025",
  DESCRIPTION: "EuroRust is a 2 day conference for the European Rust community – October 9 and 10, 2025 – Paris and online",

  WEBSITE: "https://eurorust.eu",
  TWITTER: "@euro_rust",

  COC_LINK: "https://eurorust.eu/code-of-conduct/",

  SOCIALIMAGE_LINK: "https://eurorust.eu/images/og-image.png",
  SOCIALIMAGE_ALT: "EuroRust",
};
