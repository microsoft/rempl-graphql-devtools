import { RemplWrapper } from "../rempl-wrapper";

export class ApolloGlobalOperationsPublisher {
  private static _instance: ApolloGlobalOperationsPublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloGlobalOperationsPublisher._instance) {
      return ApolloGlobalOperationsPublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      "global-operations",
      this.globalOperationsFetcherHandler.bind(this),
      6000
    );
    this.apolloPublisher = apolloPublisher;

    ApolloGlobalOperationsPublisher._instance = this;
  }

  private globalOperationsFetcherHandler() {
    if (!window.__APOLLO_GLOBAL_OPERATIONS__) {
      return;
    }

    this.apolloPublisher
      .ns("apollo-global-operations")
      .publish(window.__APOLLO_GLOBAL_OPERATIONS__);

    this.remplWrapper.unSubscribeToRemplStatus("global-operations");
  }
}
