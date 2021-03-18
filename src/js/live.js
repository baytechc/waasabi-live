// https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/#using-apollo-client-without-react
import { ApolloClient } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { InMemoryCache } from '@apollo/client/cache';

import gql from 'graphql-tag';

const GQL_LINK_WS = process.env.WAASABI_GRAPHQL_WS;
const GQL_AUTH_TOKEN = process.env.GQL_AUTH_TOKEN || '';

const MESSAGES_SUBSCRIPTION = gql`
subscription OnMessage {
  afterCreateSignal {
    signal {
      event, data, created_at,
    }
  }
}`;


let _apolloClient;
function connect(opts = {}) {
  if (_apolloClient) return _apolloClient;

  const connectionParams = {};

  if (opts.authToken) {
    connectionParams['Authorization'] = `Bearer ${opts.authToken}`;
  }

  const wsLink = new WebSocketLink({
    uri: GQL_LINK_WS,
    options: {
      reconnect: true,
      connectionParams
    }
  });

  const cache = new InMemoryCache();

  const apolloClient = new ApolloClient({
    // Provide required constructor fields
    cache: cache,
    link: wsLink,
    credentials: 'include',

    // Provide some optional constructor fields
    name: 'waasabi-experience',
    version: '1.0',
  });
  //console.log('Apollo Client ready:', apolloClient);

  _apolloClient = apolloClient;
  return apolloClient;
}

// A single GQL connection to the server per client
const gqlConnection = connect({ authToken: GQL_AUTH_TOKEN });

export default function listen(cb) {
  if (typeof cb !== 'function') {
    console.warn('Empty subscription request.');
    return;
  }

  gqlConnection.subscribe({
    query: MESSAGES_SUBSCRIPTION
  }).subscribe({
    next(incomingSignal) {
      cb(incomingSignal.data.afterCreateSignal.signal);
    }
  });
}
