import { GraphQLError } from "graphql";

import { print } from "graphql/language/printer";
import { WatchedQuery, Mutation as MutationType } from "../../types";
import { getOperationName } from "@apollo/client/utilities";

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
  query,
  change,
}: any): WatchedQuery | undefined {
  const queryData = getQueryData(id, query);
  if (!queryData) {
    return queryData;
  }

  return {
    ...queryData,
    change,
  };
}

function getQueryData(id: string, query: any): WatchedQuery | undefined {
  if (!query || !query.document) return;
  const name = getOperationName(query?.document) || "";
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
    name: getOperationName(mutation.mutation) || "",
    mutationString: print(mutation.mutation),
    variables: mutation.variables,
    errorMessage: mutation.errorMessage,
  };
}

function getRecentMutationData({
  id,
  data,
  change,
}: any): MutationType | undefined {
  if (!data) return;

  return {
    ...getMutationData(data, id),
    change,
  };
}

export const getRecentData = (queries: unknown[], mutations: unknown[]) => {
  const filteredQueries: WatchedQuery[] = queries
    .map(getRecentQueryData)
    .filter(Boolean) as WatchedQuery[];

  const mappedMutations: MutationType[] = mutations
    .map(getRecentMutationData)
    .filter(Boolean) as MutationType[];

  return { mutations: mappedMutations, queries: filteredQueries };
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
