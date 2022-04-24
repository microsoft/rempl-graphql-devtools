import { RemplWrapper } from "../rempl-wrapper";
import { NormalizedCacheObject, ApolloClient } from "@apollo/client";

import {
  WrapperCallbackParams,
  ApolloTrackerData,
  ApolloTrackerDataCount,
} from "../../types";
import { getData } from "../helpers/parse-apollo-data";
import {
  filterMutationInfo,
  filterQueryInfo,
} from "../helpers/parse-apollo-data";

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
      "apollo-tracker",
      this.trackerDataPublishHandler.bind(this),
      2000
    );
    this.apolloPublisher = apolloPublisher;

    ApolloTrackerPublisher._instance = this;
  }

  private trackerDataPublishHandler({ activeClient }: WrapperCallbackParams) {
    const data = this.serializeTrackerDataObjects(activeClient?.client);

    if (!data) {
      return;
    }
    const apolloTrackerData = getData(data);
    this.publishTrackerData(apolloTrackerData, {
      mutationsCount: apolloTrackerData.mutations.length,
      queriesCount: apolloTrackerData.queries.length,
    });
  }

  private serializeTrackerDataObjects = (
    client?: ApolloClient<NormalizedCacheObject>
  ) => {
    if (!(client as any)?.queryManager) {
      return null;
    }

    return {
      queries: this.getQueries(client)(),
      mutations: this.getMutations(client)(),
    };
  };

  private getMutations(client: any) {
    // Apollo Client 2 to 3.2
    if (client.queryManager.mutationStore?.getStore) {
      return () => client.queryManager.mutationStore.getStore();
    } else {
      // Apollo Client 3.3+
      return () => filterMutationInfo(client.queryManager.mutationStore);
    }
  }

  private getQueries(client: any) {
    if (client.queryManager.queryStore?.getStore) {
      return () => client.queryManager.queryStore.getStore();
    } else {
      return () => filterQueryInfo(client.queryManager.queries);
    }
  }

  public publishTrackerData(
    apolloTrackerData: ApolloTrackerData,
    apolloTrackerDataCount: ApolloTrackerDataCount
  ) {
    this.apolloPublisher
      .ns("apollo-tracker-mutations")
      .publish(apolloTrackerData.mutations);
    this.apolloPublisher
      .ns("apollo-tracker-queries")
      .publish(apolloTrackerData.queries);
    this.apolloPublisher
      .ns("apollo-tracker-data-count")
      .publish(apolloTrackerDataCount);
  }
}
