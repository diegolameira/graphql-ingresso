import fetch from 'node-fetch';

import {
  GraphQLInt,
  GraphQLSchema,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';

import {

  Event,
  allEvents,

  Session,
  allSessions,

} from './schemas/Event';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: '...',

  fields: () => ({

    Event,
    allEvents,

    Session,
    allSessions,

  }),
});

export default new GraphQLSchema({
  query: QueryType,
});
