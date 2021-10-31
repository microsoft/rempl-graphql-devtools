import { RemplWrapper } from "../rempl-wrapper";

import { ApolloClientObject, ApolloTrackerData } from "../../types";

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
      this.trackerDataPublishHandler.bind(this)
    );
    this.apolloPublisher = apolloPublisher;

    ApolloTrackerPublisher._instance = this;
  }

  private trackerDataPublishHandler() {
    if (!window.__APOLLO_CLIENTS__?.length) {
      return;
    }

    this.publishTrackerData(
      this.serializeTrackerDataObjects(window.__APOLLO_CLIENTS__)
    );
  }
  private filterQueryInfo(queryInfoMap: any) {
    const filteredQueryInfo: Record<string, unknown> = {};
    queryInfoMap.forEach((value: Record<string, unknown>, key: string) => {
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
    clients.reduce((acc, { client, clientId }: ApolloClientObject) => {
      if (!(client as any).queryManager) {
        return acc;
      }

      acc[clientId] = {
        queries: this.getQueries(client)(),
        mutations: this.getMutations(client)(),
      };
      return acc;
    }, {} as ApolloTrackerData);

  private getMutations(client: any) {
    // Apollo Client 2 to 3.2
    if (client.queryManager.mutationStore?.getStore) {
      return () => client.queryManager.mutationStore.getStore();
    } else {
      // Apollo Client 3.3+
      return () => client.queryManager.mutationStore;
    }
  }

  private getQueries(client: any) {
    if (client.queryManager.queryStore?.getStore) {
      return () => client.queryManager.queryStore.getStore();
    } else {
      return () => this.filterQueryInfo(client.queryManager.queries);
    }
  }

  public publishTrackerData(apolloTrackerData: ApolloTrackerData) {
    this.apolloPublisher.ns("apollo-tracker").publish(apolloTrackerData);
  }
}
