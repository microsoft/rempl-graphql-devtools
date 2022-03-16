import {
  ApolloClient,
  from,
  NormalizedCacheObject,
  Resolvers as ApolloResolvers,
} from "@apollo/client";

import { makeExecutableSchema } from "@graphql-tools/schema";

import {
  helloResolver,
  chatResolver,
  addMessageResolver,
  removeMessageResolver,
} from "./resolver/resolvers";

import createGraphQLContext, { IGraphQLContext } from "./graphql-context";
import { cache } from "./cache";
import typeDefs from "./typeDefs";
import { SchemaLink } from "@apollo/client/link/schema";

export const buildClient: () => ApolloClient<NormalizedCacheObject> = () => {
  const schema = makeExecutableSchema<IGraphQLContext>({
    typeDefs,
    resolvers: buildResolvers(),
  });

  return new ApolloClient({
    cache,
    link: from([
      new SchemaLink({
        schema: schema,
        context: createGraphQLContext(),
      }),
    ]),
  });
};

const queryResolvers = {
  hello: helloResolver,
  chat: chatResolver,
};

const mutationResolvers = {
  addMessage: addMessageResolver,
  removeMessage: removeMessageResolver,
};

const buildResolvers: () => ApolloResolvers = () => {
  const resolvers = {
    Query: queryResolvers,
    Mutation: mutationResolvers,
  };

  return resolvers as ApolloResolvers;
};
