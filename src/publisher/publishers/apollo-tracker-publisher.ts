import { RemplWrapper } from "../rempl-wrapper";
import { GraphQLError } from "graphql";

import { ClientObject, ApolloTrackerData } from "../../types";

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

  private trackerDataPublishHandler(clientObjects: ClientObject[]) {
    this.publishTrackerData(this.serializeTrackerDataObjects(clientObjects));
  }

  private filterQueryInfo(queryInfoMap: any) {
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
        const graphQLErrorMessage = this.getErrorMessage(
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

  private getErrorMessage(graphQLErrors?: GraphQLError[]) {
    if (!graphQLErrors || !graphQLErrors.length) {
      return;
    }

    return `Path: ${graphQLErrors[0].path} Stack: ${graphQLErrors[0].stack}`;
  }

  private filterMutationInfo(mutations: any) {
    const filteredMutationInfo: Record<string, unknown> = {};
    Object.keys(mutations).forEach((key: string) => {
      const error = mutations[key].error;

      const graphQLErrorMessage = this.getErrorMessage(
        error?.graphQLErrors as GraphQLError[]
      );

      const networkErrorMessage = (error?.networkError as Error)?.stack;

      filteredMutationInfo[key] = {
        mutation: mutations[key].mutation,
        variables: mutations[key].variables,
        errorMessage:
          graphQLErrorMessage || networkErrorMessage || error?.stack,
      };
    });
    return filteredMutationInfo;
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
      return () => this.filterMutationInfo(client.queryManager.mutationStore);
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
