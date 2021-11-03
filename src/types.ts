import { NormalizedCacheObject, ApolloClient } from "@apollo/client";

export type ApolloClientObject = {
  clientId: string;
  client: ApolloClient<NormalizedCacheObject>;
};

export type ApolloGlobalOperations = {
  globalQueries: string[];
  globalMutations: string[];
  globalSubscriptions: string[];
};

declare let __APOLLO_DEVTOOLS_SUBSCRIBER__: string;
declare global {
  interface Window {
    __APOLLO_CLIENTS__: ApolloClientObject[];
    __APOLLO_GLOBAL_OPERATIONS__: ApolloGlobalOperations;
  }
}

export type ClientCacheObject = {
  [key: string]: {
    cache: NormalizedCacheObject;
    recentCache: NormalizedCacheObject;
  };
};

export type ApolloTrackerData = {
  [clientId: string]: {
    mutations: unknown[];
    queries: unknown[];
  };
};

export type ClientRecentCacheObject = {
  [clientId: string]: NormalizedCacheObject;
};

export type ApolloClientsObject = {
  [clientId: string]: ApolloClient<NormalizedCacheObject>;
};

export type FetcherParams = {
  query: string;
  operationName: string;
  variables?: any;
};
