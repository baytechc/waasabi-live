// https://www.apollographql.com/docs/react/migrating/apollo-client-3-migration/#using-apollo-client-without-react
import { ApolloClient } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { InMemoryCache } from '@apollo/client/cache';

// https://github.com/apollographql/subscriptions-transport-ws
import { SubscriptionClient } from 'subscriptions-transport-ws';

import gql from 'graphql-tag';

const GQL_LINK_WS = process.env.WAASABI_GRAPHQL_WS;
const GQL_AUTH_TOKEN = process.env.GQL_AUTH_TOKEN || '';

const MESSAGES_SUBSCRIPTION = gql`
  subscription OnMessageReceived {
    afterCreateChatMessage {
      chatMessage {
        received_by,
        channel, channel_name,
        sender,
        message, message_details
      }
    }
  }
`;

let _apolloClient;
function initClient(opts = {}) {
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
  console.log('Apollo Client ready:', apolloClient);

  _apolloClient = apolloClient;
  return apolloClient;
}

export default function subscribeToNewMessages(cb) {
  const apolloClient = initClient({ authToken: GQL_AUTH_TOKEN });

  let sub = apolloClient.subscribe({
    query: MESSAGES_SUBSCRIPTION
  }).subscribe({
    next (result) {
      const { chatMessage } = result.data.afterCreateChatMessage;

      if (typeof cb == 'function') cb(chatMessage);
      console.log('New message!', chatMessage);
    }
  });
}


// Autostart
subscribeToNewMessages(msg => {
  let el = document.querySelector('.plugin.chatroom');
  if (!el) return;

  let message = msg.message.replace(/<|>/g,'').replace(/\n/g,'<br>');
  el.insertAdjacentHTML('beforeend', `<p class="chat-msg"><strong>${msg.sender}:</strong> ${message}</p>`);
  setTimeout(() => {
    const scrollTopMax = el.scrollHeight-el.clientHeight; // Chrome doesn't support el.scrollTopMax
    if (scrollTopMax>el.scrollTop) el.scrollTop=scrollTopMax;
  }, 1);
});
