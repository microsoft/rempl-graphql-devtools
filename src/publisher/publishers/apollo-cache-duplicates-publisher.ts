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
    this.client = activeClient;
  }

  private attachMethodsToPublisher() {
    this.apolloPublisher.provide(
      "getCacheDuplicates",
      ({}: {}, callback: () => void) => {
        console.log("test");
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
    this.publishCache(serializedCacheDuplicatesObject);
  }

  public publishCache(cacheObjects: CacheDuplicates) {
    console.log(cacheObjects);
    this.apolloPublisher.ns("apollo-cache-duplicates").publish(cacheObjects);
  }
}
