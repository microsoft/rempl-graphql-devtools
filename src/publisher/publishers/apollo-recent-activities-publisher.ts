import { RemplWrapper } from "../rempl-wrapper";
import { GraphQLError } from "graphql";
import { NormalizedCacheObject, ApolloClient } from "@apollo/client";
import { getRecentActivities } from "../helpers/recent-activities";
import { ClientObject, ApolloRecentActivities } from "../../types";
import {
  filterMutationInfo,
  filterQueryInfo,
  getRecentData,
} from "../helpers/parse-apollo-data";

export class ApolloRecentActivitiesPublisher {
  private static _instance: ApolloRecentActivitiesPublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private lastIterationData: {
    mutations: unknown[];
    queries: Map<number, unknown>;
  } = {
    mutations: [],
    queries: new Map(),
  };

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloRecentActivitiesPublisher._instance) {
      return ApolloRecentActivitiesPublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      "recent-activities",
      this.trackerDataPublishHandler.bind(this),
      2000
    );
    this.apolloPublisher = apolloPublisher;

    ApolloRecentActivitiesPublisher._instance = this;
  }

  private trackerDataPublishHandler(
    clientObjects: ClientObject[],
    activeClientId: string | null
  ) {
    if (!activeClientId) {
      return;
    }
    const activeClient = clientObjects.find(
      (client: ClientObject) => client.clientId === activeClientId
    );

    if (!activeClient) {
      return;
    }

    const newData = this.serializeRecentActivitiesDataObjects(
      activeClient.client
    );

    if (!newData.mutationLog.count && !newData.watchedQueries.count) {
      return;
    }

    this.publishRecentActivitiesData(newData);
  }

  private serializeRecentActivitiesDataObjects = (
    client: ApolloClient<NormalizedCacheObject>
  ): ApolloRecentActivities => {
    const recentQueries = this.getQueriesRecentActivities(client);
    const recentMutations = this.getMutationsRecentActivities(client);

    return getRecentData(recentQueries, recentMutations);
  };

  private getQueriesRecentActivities(
    client: ApolloClient<NormalizedCacheObject>
  ) {
    const currentQueries = this.getQueries(client);
    if (!this.lastIterationData.queries.size) {
      this.lastIterationData.queries = new Map(currentQueries);

      return [];
    }
    const currentQueriesValues = Array.from(currentQueries.values());
    const lastIterationValues = Array.from(
      this.lastIterationData.queries.values()
    );
    this.lastIterationData.queries = new Map(currentQueries);

    return getRecentActivities(currentQueriesValues, lastIterationValues) || [];
  }

  private getMutationsRecentActivities(
    client: ApolloClient<NormalizedCacheObject>
  ) {
    const currentMutations = this.getMutations(client);
    if (!Object.keys(this.lastIterationData.mutations).length) {
      this.lastIterationData.mutations = {
        ...currentMutations,
      };
      return [];
    }
    const currentMutationsValues = Object.values(currentMutations);
    const lastIterationValues = Object.values(this.lastIterationData.mutations);

    this.lastIterationData.mutations = {
      ...currentMutations,
    };

    return (
      getRecentActivities(currentMutationsValues, lastIterationValues) || []
    );
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

  public publishRecentActivitiesData(
    apolloRecentActivitiesData: ApolloRecentActivities
  ) {}
}
