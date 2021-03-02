// https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/#using-apollo-client-without-react
import { ApolloClient } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { InMemoryCache } from '@apollo/client/cache';

import gql from 'graphql-tag';

const GQL_LINK_WS = process.env.WAASABI_GRAPHQL_WS;
const GQL_AUTH_TOKEN = process.env.GQL_AUTH_TOKEN || '';

const MESSAGES_SUBSCRIPTION = gql`
subscription OnMessage {
  afterCreateAttendeePush {
    attendeePush {
      type, created_at, message
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

export default function listen(cb) {
  const apolloClient = connect({ authToken: GQL_AUTH_TOKEN });

  let sub = apolloClient.subscribe({
    query: MESSAGES_SUBSCRIPTION
  }).subscribe({
    next (result) {
      const message = result.data.afterCreateAttendeePush.attendeePush;

      if (typeof cb == 'function') cb(message);
      //console.log('PUSH ', message);
    }
  });
}


// Autostart
listen(msg => {
});
