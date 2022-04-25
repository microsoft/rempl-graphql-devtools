import { GraphQLError, print, getOperationAST } from "graphql";

import {
  WatchedQuery,
  Mutation as MutationType,
  RecentActivityRaw,
  RecentActivity,
  RecentActivities,
} from "../../types";

export function filterMutationInfo(mutations: any) {
  const filteredMutationInfo: Record<string, unknown> = {};
  Object.keys(mutations).forEach((key: string) => {
    const error = mutations[key].error;

    const graphQLErrorMessage = getErrorMessage(
      error?.graphQLErrors as GraphQLError[]
    );

    const networkErrorMessage = (error?.networkError as Error)?.stack;

    filteredMutationInfo[key] = {
      mutation: mutations[key].mutation,
      variables: mutations[key].variables,
      errorMessage: graphQLErrorMessage || networkErrorMessage || error?.stack,
    };
  });
  return filteredMutationInfo;
}

export function getErrorMessage(graphQLErrors?: GraphQLError[]) {
  if (!graphQLErrors || !graphQLErrors.length) {
    return;
  }

  return `Path: ${graphQLErrors[0].path} Stack: ${graphQLErrors[0].stack}`;
}

export function filterQueryInfo(queryInfoMap: any) {
  const filteredQueryInfo: Record<string, unknown> = {};
  queryInfoMap.forEach(
    (
      {
        variables,
        document,
        graphQLErrors,
        networkError,
      }: Record<string, unknown>,
      key: string
    ) => {
      const graphQLErrorMessage = getErrorMessage(
        graphQLErrors as GraphQLError[]
      );

      const networkErrorMessage = (networkError as Error)?.stack;

      filteredQueryInfo[key] = {
        document,
        variables,
        errorMessage: graphQLErrorMessage || networkErrorMessage,
      };
    }
  );
  return filteredQueryInfo;
}

function getRecentQueryData({
  id,
  data,
  change,
}: RecentActivityRaw): RecentActivity<WatchedQuery> | undefined {
  const queryData = getQueryData(id, data);
  if (!queryData) {
    return queryData;
  }

  return {
    id,
    data: queryData,
    change,
  };
}

function getQueryData(id: string, query: any): WatchedQuery | undefined {
  if (!query || !query.document) return;
  const name = getOperationAST(query?.document)?.name?.value || "";
  if (name === "IntrospectionQuery") {
    return;
  }

  return {
    id,
    typename: "WatchedQuery",
    name,
    queryString: print(query.document),
    variables: query.variables,
    cachedData: query.cachedData,
  };
}

function getMutationData(mutation: any, id: string): MutationType {
  return {
    id,
    typename: "Mutation",
    name: getOperationAST(mutation.mutation)?.name?.value || "",
    mutationString: print(mutation.mutation),
    variables: mutation.variables,
    errorMessage: mutation.errorMessage,
  };
}

function getRecentMutationData({
  id,
  data,
  change,
}: RecentActivityRaw): RecentActivity<MutationType> | undefined {
  if (!data) return;

  return {
    id,
    data: getMutationData(data, id),
    change,
  };
}

export const getRecentData = (
  queries: RecentActivityRaw[],
  mutations: RecentActivityRaw[],
  timestamp: number
): RecentActivities => {
  const filteredQueries: RecentActivity<WatchedQuery>[] = queries
    .map(getRecentQueryData)
    .filter(Boolean) as RecentActivity<WatchedQuery>[];

  const mappedMutations: RecentActivity<MutationType>[] = mutations
    .map(getRecentMutationData)
    .filter(Boolean) as RecentActivity<MutationType>[];

  return { mutations: mappedMutations, queries: filteredQueries, timestamp };
};

export const getData = ({
  queries,
  mutations,
}: {
  mutations: unknown[];
  queries: unknown[];
}) => {
  const watchedQueries: WatchedQuery[] = Object.values(queries || {})
    .map((q, i: number) => getQueryData(i.toString(), q))
    .filter(Boolean) as WatchedQuery[];

  const mutationLog: MutationType[] = Object.values(mutations || {})
    .map((m, i: number) => getMutationData(m, i.toString()))
    .filter(Boolean) as MutationType[];

  return { mutations: mutationLog, queries: watchedQueries };
};
