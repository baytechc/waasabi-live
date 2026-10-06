import { createClient } from 'graphql-ws';
import { JWT } from './auth.js'

const GQL_LINK_WS = process.env.WAASABI_GRAPHQL_WS;

const SUB_SIGNALS = `
subscription OnSignal {
  newPushEvent {
    id, event, data, created_at,
  }
}`;

let _wsClient;
function connect(opts = {}) {
  if (_wsClient) return _wsClient;

  const connectionParams = {};

  if (opts.authToken) {
    connectionParams['Authorization'] = `Bearer ${opts.authToken}`;
  }

  _wsClient = createClient({
    url: GQL_LINK_WS,
    connectionParams: () => ({ Authorization: `Bearer ${opts.authToken}` }),
    keepAlive: 25_000
  });

  return _wsClient;
}

// A single GQL connection to the server per client
const gqlConnection = connect({});

const gqlSignals = gqlConnection.iterate({ query: SUB_SIGNALS });

export async function onSignal(cb) {
  if (typeof cb !== 'function') {
    console.warn('Empty subscription request.');
    return;
  }

  for await (const incoming of gqlSignals) {
    console.log('Incoming gqlSignal: ', incoming)
    cb(incoming.data.newPushEvent);
  }
}
