import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { RemplWrapper } from "../rempl-wrapper";
import {
  CacheDuplicates,
  ClientObject,
  ApolloKeyFields,
  WrapperCallbackParams,
} from "../../types";
import { getClientCacheDuplicates } from "../helpers/duplicate-cache-items";

export class ApolloCacheDuplicatesPublisher {
  private static _instance: ApolloCacheDuplicatesPublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private duplicatesCacheItems: CacheDuplicates = [];
  private client: ClientObject | null = null;
  private apolloKeyFields: ApolloKeyFields = {};

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloCacheDuplicatesPublisher._instance) {
      return ApolloCacheDuplicatesPublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      "apollo-cache-duplicates",
      this.cacheDuplicatesHandler.bind(this),
      1500
    );
    this.apolloPublisher = apolloPublisher;
    this.attachMethodsToPublisher();

    ApolloCacheDuplicatesPublisher._instance = this;
  }

  private cacheDuplicatesHandler({ activeClient }: WrapperCallbackParams) {
    if (this.client?.clientId !== activeClient?.clientId) {
      this.publishCacheDuplicates([]);
    }
    this.client = activeClient;
  }

  private attachMethodsToPublisher() {
    this.apolloPublisher.provide(
      "getCacheDuplicates",
      ({}: {}, callback: () => void) => {
        this.publishCacheDuplicatesForClientId();
        callback();
      }
    );
  }

  private getCache(client: ApolloClient<NormalizedCacheObject>) {
    return client.cache.extract(true);
  }

  private serializeCacheDuplicatesObjects({ client }: ClientObject) {
    const cache = this.getCache(client);
    this.duplicatesCacheItems = getClientCacheDuplicates(
      cache,
      this.apolloKeyFields
    );

    return this.duplicatesCacheItems;
  }

  private publishCacheDuplicatesForClientId() {
    if (!this.client) {
      return;
    }

    const serializedCacheDuplicatesObject =
      this.serializeCacheDuplicatesObjects(this.client);
    this.publishCacheDuplicates(serializedCacheDuplicatesObject);
  }

  public publishCacheDuplicates(cacheObjects: CacheDuplicates) {
    this.apolloPublisher.ns("apollo-cache-duplicates").publish(cacheObjects);
  }
}
