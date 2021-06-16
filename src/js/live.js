// https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/#using-apollo-client-without-react
import { ApolloClient } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { InMemoryCache } from '@apollo/client/cache';

import gql from 'graphql-tag';

const GQL_LINK_WS = process.env.WAASABI_GRAPHQL_WS;
//const GQL_AUTH_TOKEN = process.env.GQL_AUTH_TOKEN || '';

const SUB_SIGNALS = gql`
subscription OnSignal {
  afterCreateSignal {
    signal {
      event, data, ts,
    }
  }
}`;
const SUB_CHAT_MESSAGES = gql`
subscription OnChatMessage {
  afterCreateChatMessage {
    chatMessage {
      sender, message, message_details, ts,
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
//const gqlConnection = connect({ authToken: GQL_AUTH_TOKEN });
const gqlConnection = connect({});

const gqlSignals = gqlConnection.subscribe({ query: SUB_SIGNALS });
const gqlChatMessages = gqlConnection.subscribe({ query: SUB_CHAT_MESSAGES });

export function onSignal(cb) {
  if (typeof cb !== 'function') {
    console.warn('Empty subscription request.');
    return;
  }

  gqlSignals.subscribe({
    next(incoming) {
      cb(incoming.data.afterCreateSignal.signal);
    }
  });
}

export function onChatMessage(cb) {
  if (typeof cb !== 'function') {
    console.warn('Empty subscription request.');
    return;
  }

  gqlChatMessages.subscribe({
    next(incoming) {
      cb(incoming.data.afterCreateChatMessage.chatMessage);
    }
  });
}
