export default {
  "WAASABI_BACKEND": "https://backend.rustfest.global",
  "WAASABI_GRAPHQL_WS": "wss://backend.rustfest.global/graphql",

  WAASABI_SESSION_URL: "https://rustfest.global/session/%SLUG%/",

  WAASABI_CHAT_ENABLED: true,
  WAASABI_CHAT_SYSTEM: "matrix",
  WAASABI_CHAT_INVITES: false,
  WAASABI_CHAT_INFO: "",

  WAASABI_MATRIX_SERVER: "rustch.at",
  WAASABI_MATRIX_CLIENT_URL: "https://rustch.at",
  WAASABI_MATRIX_API_URL: "https://rustch.at",

  WAASABI_BRAND: "brand-rfg",

  BUILD_DIR: "_site",
  BUILD_COPY: {
    // TODO: globs
    // Copy VideoJS assets
    "node_modules/video.js/dist/video-js.min.css": "assets/videojs",
  },

  PREFIX: "/waasabi_live",

  TITLE: "RustFest LATAM Live!",
  DESCRIPTION: "Conferencia de Rust comunitaria en español e inglés. Community Rust conference in English & Spanish.",

  WEBSITE: "https://rustfest.global/",
  TWITTER: "@rustfest",

  COC_LINK: "https://rustfest.global/coc",

  SOCIALIMAGE_LINK: "",
  SOCIALIMAGE_ALT: "",

  PAYMENTPTR: "$ilp.uphold.com/2YdXerkKdULj",
};
