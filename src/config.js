export default {
  WAASABI_BACKEND: "https://watch.eurorust.eu/api/v1",
  WAASABI_GRAPHQL_WS: "wss://watch.eurorust.eu/events",

  WAASABI_SESSION_URL: "https://rustfest.global/session/%SLUG%/",

  WAASABI_CHAT_ENABLED: true,
  WAASABI_CHAT_SYSTEM: "matrix",
  WAASABI_CHAT_INVITES: false,
  WAASABI_CHAT_INFO: "",

  WAASABI_MATRIX_SERVER: "rustch.at",
  WAASABI_MATRIX_CLIENT_URL: "https://rustch.at",
  WAASABI_MATRIX_API_URL: "https://rustch.at",

  WAASABI_BRAND: "brand-eurorust",

  BUILD_DIR: "_site",
  BUILD_COPY: {
    // TODO: globs
    // Copy VideoJS assets
    "node_modules/video.js/dist/video-js.min.css": "assets/videojs",
  },

  PREFIX: "",

  TITLE: "EuroRust 2023",
  DESCRIPTION: "A Rust conference from the European Rust community.",

  WEBSITE: "https://eurorust.eu",
  TWITTER: "@euro_rust",

  COC_LINK: "https://eurorust.eu/code-of-conduct/",

  SOCIALIMAGE_LINK: "https://eurorust.eu/images/euro-rust-2023-social.png",
  SOCIALIMAGE_ALT: "EuroRust",
};
