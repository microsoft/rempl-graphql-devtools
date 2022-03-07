import { RemplWrapper } from "../rempl-wrapper";
import { parse } from "graphql";

import { ApolloClientsObject, FetcherParams, ClientObject } from "../../types";

export class GraphiQLPublisher {
  private static _instance: GraphiQLPublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private apolloClients: ApolloClientsObject = {};

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (GraphiQLPublisher._instance) {
      return GraphiQLPublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      this.cachePublishHander.bind(this)
    );
    this.apolloPublisher = apolloPublisher;
    this.attachMethodsToPublisher();

    GraphiQLPublisher._instance = this;
  }

  private attachMethodsToPublisher() {
    this.apolloPublisher.provide(
      "graphiql",
      (
        activeClientId: string,
        graphQLParams: FetcherParams,
        callback: (result: unknown) => void
      ) => {
        const client = this.apolloClients[activeClientId];
        client
          .query({
            query: parse(graphQLParams.query),
            variables: graphQLParams.variables,
          })
          .then((result) => {
            callback(result);
          })
          .catch((err) => {
            callback(err);
          });
      }
    );
  }

  private cachePublishHander(apolloClients: ClientObject[]) {
    const clients = apolloClients;
    for (const client of clients) {
      if (this.apolloClients[client.clientId]) {
        continue;
      }
      this.apolloClients[client.clientId] = client.client;
    }
  }
}
