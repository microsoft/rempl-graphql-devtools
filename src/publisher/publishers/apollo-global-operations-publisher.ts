import { RemplWrapper } from "../rempl-wrapper";

export class ApolloGlobalOperationsPublisher {
  private static _instance: ApolloGlobalOperationsPublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private isPublished = false;

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloGlobalOperationsPublisher._instance) {
      return ApolloGlobalOperationsPublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      this.globalOperationsFetcherHandler.bind(this)
    );
    this.apolloPublisher = apolloPublisher;

    ApolloGlobalOperationsPublisher._instance = this;
  }

  private globalOperationsFetcherHandler() {
    if (!window.__APOLLO_GLOBAL_OPERATIONS__ || this.isPublished) {
      return;
    }

    this.apolloPublisher
      .ns("apollo-global-operations")
      .publish(window.__APOLLO_GLOBAL_OPERATIONS__);
    this.isPublished = true;
  }
}
