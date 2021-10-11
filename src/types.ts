import { NormalizedCacheObject, ApolloClient } from "@apollo/client";

export type ApolloClientObject = {
  clientId: string;
  client: ApolloClient<NormalizedCacheObject>;
};

declare let __APOLLO_DEVTOOLS_SUBSCRIBER__: string;
declare global {
  interface Window {
    __APOLLO_CLIENTS__: ApolloClientObject[];
  }
}

export type ClientCacheObject = {
  clientId: string;
  cache: NormalizedCacheObject;
};

export type RemoveCacheKeyData = {
  clientId: string;
  key: string;
};

export type ApolloTrackerData = {
  clientId: string;
  mutations: any[];
  queries: any[];
};

export type ApolloClientData = {
  clientId: string;
  mutations: any[];
  queries: any[];
};
