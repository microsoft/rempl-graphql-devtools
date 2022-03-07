import { ApolloClient } from "@apollo/client/core";
import { NormalizedCacheObject } from "@apollo/client/cache";
import { RemplWrapper } from "../rempl-wrapper";
import { ClientCacheDuplicates, ClientObject } from "../../types";
import { getClientCacheDuplicates } from "../helpers/duplicate-cache-items";

export class ApolloCacheDuplicatesPublisher {
  private static _instance: ApolloCacheDuplicatesPublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private clientsArray: null | ClientObject[] = null;
  private duplicatesCacheItems: ClientCacheDuplicates = {};

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloCacheDuplicatesPublisher._instance) {
      return ApolloCacheDuplicatesPublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.apolloPublisher = apolloPublisher;
    this.attachMethodsToPublisher();

    ApolloCacheDuplicatesPublisher._instance = this;
  }

  private attachMethodsToPublisher() {
    this.apolloPublisher.provide(
      "getCacheDuplicates",
      ({ clientId }: { clientId: string }, callback: () => void) => {
        console.log("fired");
        this.publishCacheDuplicatesForClientId(clientId);
        callback();
      }
    );
  }

  private getCache(client: ApolloClient<NormalizedCacheObject>) {
    return client.cache.extract(true);
  }

  private serializeCacheDuplicatesObjects({ clientId, client }: ClientObject) {
    const cache = this.getCache(client);
    this.duplicatesCacheItems[clientId] = getClientCacheDuplicates(cache);

    return this.duplicatesCacheItems;
  }

  private publishCacheDuplicatesForClientId(clientIdToCheck: string) {
    if (!window.__APOLLO_CLIENTS__?.length) {
      return;
    }

    this.clientsArray = window.__APOLLO_CLIENTS__;

    const client = this.clientsArray.find(
      ({ clientId }) => clientId === clientIdToCheck
    );

    if (!client) {
      return;
    }

    const serializedCacheDuplicatesObject =
      this.serializeCacheDuplicatesObjects(client);
    this.publishCache(serializedCacheDuplicatesObject);
  }

  public publishCache(cacheObjects: ClientCacheDuplicates) {
    this.apolloPublisher.ns("apollo-cache-duplicates").publish(cacheObjects);
  }
}
