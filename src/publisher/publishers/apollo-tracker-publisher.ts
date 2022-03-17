import { RemplWrapper } from "../rempl-wrapper";
import { GraphQLError } from "graphql";

import { ClientObject, ApolloTrackerData } from "../../types";
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

  private trackerDataPublishHandler(clientObjects: ClientObject[]) {
    this.publishTrackerData(this.serializeTrackerDataObjects(clientObjects));
  }

  private serializeTrackerDataObjects = (clients: ClientObject[]) =>
    clients.reduce((acc, { client, clientId }: ClientObject) => {
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

  public publishTrackerData(apolloTrackerData: ApolloTrackerData) {
    this.apolloPublisher.ns("apollo-tracker").publish(apolloTrackerData);
  }
}
