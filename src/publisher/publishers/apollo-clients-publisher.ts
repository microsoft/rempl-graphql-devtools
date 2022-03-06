import { RemplWrapper } from "../rempl-wrapper";
import { ApolloClientObject } from "../../types";

export class ApolloClientsPublisher {
  private static _instance: ApolloClientsPublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private activeClients: Set<string> = new Set();

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloClientsPublisher._instance) {
      return ApolloClientsPublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      this.globalOperationsFetcherHandler.bind(this)
    );
    this.apolloPublisher = apolloPublisher;

    ApolloClientsPublisher._instance = this;
  }

  private updateActiveClients(apolloClients: ApolloClientObject[]) {
    this.activeClients = new Set(
      apolloClients.map((apolloClients) => apolloClients.clientId)
    );
  }

  private hasApolloClientsChanged(apolloClients: ApolloClientObject[]) {
    let hasChanged;
    if (apolloClients.length !== this.activeClients.size) {
      hasChanged = true;
    }

    hasChanged = apolloClients.some(
      (client: ApolloClientObject) => !this.activeClients.has(client.clientId)
    );

    if (hasChanged) {
      this.updateActiveClients(apolloClients);
    }

    return hasChanged;
  }

  private globalOperationsFetcherHandler(apolloClients: ApolloClientObject[]) {
    if (!this.hasApolloClientsChanged(apolloClients)) {
      return;
    }

    const apolloClientIds = apolloClients.map(
      (apolloClient) => apolloClient.clientId
    );

    this.apolloPublisher.ns("apollo-client-ids").publish(apolloClientIds);
  }
}
