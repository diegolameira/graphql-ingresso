import express from 'express';
import graphQLHTTP from 'express-graphql';

import schema from './schema';

const CONFIG = {
  port: process.env.PORT || 5000,
};

const app = express();

app.use(graphQLHTTP({
  schema,
  graphiql: true,
}));

app.listen(CONFIG.port);

console.log(`
yeah, we did it! :3

########################################
express listening to port ${CONFIG.port}
----------------------------------------
you can access locally through
http://localhost:${CONFIG.port}
########################################
`);