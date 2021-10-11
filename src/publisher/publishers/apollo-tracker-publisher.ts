import { RemplWrapper } from "../rempl-wrapper";

import { ApolloClientObject } from "../../types";

export class ApolloTrackerPublisher {
  private static _instance: ApolloTrackerPublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloTrackerPublisher._instance) {
      return ApolloTrackerPublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      this.queryFetcherHandler.bind(this)
    );
    this.apolloPublisher = apolloPublisher;

    ApolloTrackerPublisher._instance = this;
  }

  private queryFetcherHandler() {
    if (!window.__APOLLO_CLIENTS__?.length) {
      return;
    }

    this.publishTrackerData(
      this.serializeTrackerDataObjects(window.__APOLLO_CLIENTS__)
    );
  }
  private filterQueryInfo(queryInfoMap: any) {
    const filteredQueryInfo = {};
    queryInfoMap.forEach((value: any, key: string) => {
      filteredQueryInfo[key] = {
        document: value.document,
        graphQLErrors: value.graphQLErrors,
        networkError: value.networkError,
        networkStatus: value.networkStatus,
        variables: value.variables,
      };
    });
    return filteredQueryInfo;
  }
  private serializeTrackerDataObjects = (clients: ApolloClientObject[]) =>
    clients.map(({ client, clientId }: ApolloClientObject) => ({
      clientId,
      queries: this.getQueries(client)(),
      mutations: this.getMutations(client)(),
    }));

  private getMutations(client: any) {
    if (!client || !client.queryManager) {
      return () => {};
    }
    // Apollo Client 2 to 3.2
    if (
      client.queryManager.mutationStore &&
      client.queryManager.mutationStore.getStore
    ) {
      return () => client.queryManager.mutationStore.getStore();
    } else {
      // Apollo Client 3.3+
      return () => client.queryManager.mutationStore;
    }
  }

  private getQueries(client: any) {
    if (!client || !client.queryManager) {
      return () => {};
    }

    if (client.queryManager.queryStore) {
      if (client.queryManager.queryStore.getStore) {
        return () => client.queryManager.queryStore.getStore();
      }
    } else if (client.queryManager.queries) {
      return () => this.filterQueryInfo(client.queryManager.queries);
    }
    return () => {};
  }

  public publishTrackerData(queries: (() => void)[]) {
    this.apolloPublisher.ns("apollo-tracker").publish(queries);
  }
}
