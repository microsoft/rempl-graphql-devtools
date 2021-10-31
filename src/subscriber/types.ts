interface Query {
  id: number;
  name: string;
  variables: Record<string, unknown>;
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

export type ApolloTrackerContextData = {
  [clientId: string]: {
    watchedQueries: {
      queries: WatchedQuery[];
      count: number;
    };
    mutationLog: {
      mutations: Mutation[];
      count: number;
    };
  };
};
