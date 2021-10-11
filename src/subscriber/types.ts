import { ApolloQueryResult } from "@apollo/client";

export type QueryResult = ApolloQueryResult<any>;

export interface GraphiQLResponse {
  operationName: string;
  response: QueryResult;
}

export interface MessageObj<TPayload = any> {
  to?: string;
  message: string;
  payload?: TPayload;
}

export type CustomEventListener<T = any> = (message: MessageObj<T>) => void;

interface Query {
  id: number;
  name: string | null;
  variables: object;
}

export type WatchedQuery = Query & {
  typename: "WatchedQuery";
  queryString: string;
  cachedData: object;
};

export type Mutation = Query & {
  typename: "Mutation";
  mutationString: string;
};

export type ApolloTrackerContextData = {
  clientId: string;
  watchedQueries: {
    queries: WatchedQuery[];
    count: number;
  };
  mutationLog: {
    mutations: Mutation[];
    count: number;
  };
};
