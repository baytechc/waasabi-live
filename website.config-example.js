export default {
  // If you want a custom branding, place the files you would like to override
  // in the "brand" folder in the root directory.
  // You can have multiple branding folders and choose between them
  // by changing this variable. The default value is 'brand'
  WAASABI_BRAND: 'brand',

  // The URL of the Waasabi backend
  WAASABI_BACKEND: 'https://live.example.com/waasabi',

  // GraphQL WebSocket connection string to the Waasabi backend
  WAASABI_GRAPHQL_WS: 'wss://live.example.com/graphql',

  // External link to sessions (default: do not link)
  WAASABI_SESSION_URL: '',

  // Is chat enabled? What chat system is used?
  WAASABI_CHAT_ENABLED: true,
  WAASABI_CHAT_SYSTEM: 'matrix',

  // Public or invite only Matrix room(s)
  WAASABI_CHAT_INVITES: false,
  WAASABI_CHAT_URL: 'https://matrix.to/#/%23example:matrix.org',

  // The Matrix web client to link to
  WAASABI_MATRIX_CLIENT: 'https://app.element.io/',

  // The Matrix API server to use
  WAASABI_MATRIX_API: 'https://matrix.org/_matrix/',
}