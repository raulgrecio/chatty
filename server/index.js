import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws-authy';
import jwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';

import { JWT_SECRET, GRAPHQL_SERVER, GRAPHQL_PORT } from './config';
import { subscriptionManager, getSubscriptionDetails } from './subscriptions';
import executableSchema from './data/schema';
import { User } from './data/connectors';
import { subscriptionLogic } from './data/logic';

const GRAPHQL_PATH = '/graphql';
const SUBSCRIPTIONS_PATH = '/subscriptions';

const app = express();

// `context` must be an object and can't be undefined when using connectors
app.use('/graphql', bodyParser.json(), jwt({
  secret: JWT_SECRET,
  credentialsRequired: false,
}), graphqlExpress(req => ({
  schema: executableSchema,
  context: {
    user: req.user ? User.findOne({ where: { id: req.user.id, version: req.user.version } }) : null,
  },
  debug: true, // false to not log errors
})));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://${GRAPHQL_SERVER}:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`,
}));

const graphQLServer = createServer(app);

graphQLServer.listen(GRAPHQL_PORT, () => {
  console.log(`GraphQL Server is now running on http://${GRAPHQL_SERVER}:${GRAPHQL_PORT}${GRAPHQL_PATH}`); // eslint-disable-line no-console
  console.log(`GraphQL Subscriptions are now running on ws://${GRAPHQL_SERVER}:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`); // eslint-disable-line no-console
});

// eslint-disable-next-line no-new
new SubscriptionServer({
  subscriptionManager,
  onSubscribe(parsedMessage, baseParams) {
    const { subscriptionName, args } = getSubscriptionDetails({
      baseParams,
      schema: subscriptionManager.schema,
    });

    const user = new Promise((res, rej) => {
      if (baseParams.context.jwt) {
        jsonwebtoken.verify(baseParams.context.jwt, JWT_SECRET, (err, decoded) => {
          if (err) {
            rej('Invalid Token');
          }

          res(User.findOne({ where: { id: decoded.id, version: decoded.version } }));
        });
      } else {
        res(null);
      }
    });

    return subscriptionLogic[subscriptionName](baseParams, args, { user });
  },
}, {
  server: graphQLServer,
  path: SUBSCRIPTIONS_PATH,
});
