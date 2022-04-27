import { RemplWrapper } from "../rempl-wrapper";
import { NormalizedCacheObject, ApolloClient } from "@apollo/client";

import { WrapperCallbackParams } from "../../types";
import {
  filterMutationInfo,
  filterQueryInfo,
} from "../helpers/parse-apollo-data";

export class ApolloTrackerPublisher {
  private static _instance: ApolloTrackerPublisher;
  private apolloPublisher;
  private lastRawMutations: any[] | null = null;
  private lastRawQueries: Map<number, any> | null = null;
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

  private getCountData() {
    this.apolloPublisher.ns("apollo-tracker-data-count").publish({
      queriesCount: queries ? queries.length : this.lastRawQueries?.size || 0,
      mutationsCount: mutations
        ? mutations.length
        : this.lastRawMutations?.length || 0,
    });
  }

  private trackerDataPublishHandler({ activeClient }: WrapperCallbackParams) {
    if (!activeClient) {
      return;
    }

    const mutations = this.serializeTrackerMutations(activeClient.client);
    const queries = this.serializeTrackerQueries(activeClient.client);

    if (mutations) {
      this.apolloPublisher.ns("apollo-tracker-mutations").publish(mutations);
      this.apolloPublisher
        .ns("apollo-tracker-mutations-count")
        .publish(mutations.length);
    }
    if (queries) {
      this.apolloPublisher.ns("apollo-tracker-queries").publish(queries);
      this.apolloPublisher
        .ns("apollo-tracker-queries-count")
        .publish(queries.length);
    }
  }

  private serializeTrackerMutations = (
    client: ApolloClient<NormalizedCacheObject>
  ) => {
    const mutations = Object.values(this.getMutations(client));

    const shouldUpdate = this.shouldUpdateMutations(mutations);
    this.lastRawMutations = [...mutations];

    if (!shouldUpdate) {
      return null;
    }

    return filterMutationInfo(mutations);
  };

  private serializeTrackerQueries = (
    client: ApolloClient<NormalizedCacheObject>
  ) => {
    const queries = this.getQueries(client);

    const shouldUpdate = this.shouldUpdateQueries(queries);
    this.lastRawQueries = new Map(queries);

    if (!shouldUpdate) {
      return null;
    }

    return filterQueryInfo(queries);
  };

  private shouldUpdateQueries(queries: Map<number, unknown>) {
    if (!this.lastRawQueries) {
      this.lastRawQueries = new Map(queries);
      return true;
    }
    if (this.lastRawQueries.size !== queries.size) {
      return true;
    }

    queries.forEach((query: any, key: number) => {
      if (query !== (this.lastRawQueries as Map<number, any>).get(key)) {
        return true;
      }
    });

    return false;
  }

  private shouldUpdateMutations(mutations: unknown[]) {
    if (!this.lastRawMutations) {
      this.lastRawMutations = [...mutations];
      return true;
    }

    return this.lastRawMutations.length !== mutations.length;
  }

  private getMutations(client: any) {
    // Apollo Client 2 to 3.2
    if (client.queryManager.mutationStore?.getStore) {
      return client.queryManager.mutationStore.getStore();
    } else {
      // Apollo Client 3.3+
      return client.queryManager.mutationStore;
    }
  }

  private getQueries(client: any) {
    if (client.queryManager.queryStore?.getStore) {
      return client.queryManager.queryStore.getStore();
    } else {
      return client.queryManager.queries;
    }
  }
}
