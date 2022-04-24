import {
  NormalizedCacheObject,
  ApolloClient,
  StoreObject,
} from "@apollo/client";

export type WrapperCallbackParams = {
  clientObjects: ClientObject[];
  activeClient: ClientObject | null;
};

export type ClientObject = {
  clientId: string;
  client: ApolloClient<NormalizedCacheObject>;
};

export type ApolloGlobalOperations = {
  globalQueries: string[];
  globalMutations: string[];
  globalSubscriptions: string[];
};

export type ApolloKeyFields = Record<string, string[]>;

declare let __APOLLO_DEVTOOLS_SUBSCRIBER__: string;
declare global {
  interface Window {
    __APOLLO_CLIENTS__: ClientObject[];
    __APOLLO_GLOBAL_OPERATIONS__: ApolloGlobalOperations;
    __APOLLO_KEY_FIELDS__: ApolloKeyFields;
  }
}

export type RecentActivity<Data> = {
  id: string;
  change: string;
  data: Data;
};

export type RecentActivities = {
  queries: RecentActivity<WatchedQuery>[];
  mutations: RecentActivity<Mutation>[];
  timestamp: number;
};

export type RecentActivityRaw = {
  id: string;
  change: string;
  data: unknown;
};

export type ClientCacheObject = {
  cache: NormalizedCacheObject;
  recentCache: NormalizedCacheObject;
};

export type CacheDuplicates = StoreObject[][];

export type ApolloTrackerData = {
  mutations: Mutation[];
  queries: WatchedQuery[];
};

export type ApolloTrackerDataCount = {
  mutationsCount: number;
  queriesCount: number;
};

export type ClientRecentCacheObject = NormalizedCacheObject;

export type ClientCacheDuplicates = {
  [clientId: string]: CacheDuplicates;
};

export type ApolloClientsObject = {
  [clientId: string]: ApolloClient<NormalizedCacheObject>;
};

export type FetcherParams = {
  query: string;
  operationName: string;
  variables?: any;
};

interface Query {
  id: string;
  name: string;
  change?: string;
  variables: Record<string, unknown>;
  errorMessage?: string;
}

export type WatchedQuery = Query & {
  typename: "WatchedQuery";
  queryString: string;
  cachedData: Record<string, unknown>;
};

export type Mutation = Query & {
  typename: "Mutation";
  mutationString: string;
};
