import { RemplWrapper } from "../rempl-wrapper";

import { ApolloClient } from "@apollo/client/core";
import { NormalizedCacheObject } from "@apollo/client/cache";
import {
  RemoveCacheKeyData,
  ClientCacheObject,
  ApolloClientObject,
} from "../../types";

export class ApolloCachePublisher {
  private static _instance: ApolloCachePublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private lastClientsArray: null | ApolloClientObject[] = null;

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloCachePublisher._instance) {
      return ApolloCachePublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      this.cacheFetcherHandler.bind(this)
    );
    this.apolloPublisher = apolloPublisher;
    this.attachMethodsToPublisher();

    ApolloCachePublisher._instance = this;
  }

  private attachMethodsToPublisher() {
    this.apolloPublisher.provide(
      "removeCacheKey",
      (
        { clientId: clientIdToModify, key }: RemoveCacheKeyData,
        callback: () => void
      ) => {
        if (this.lastClientsArray) {
          const clientObjectToModify = this.lastClientsArray.find(
            ({ clientId }) => clientId === clientIdToModify
          );

          if (!clientObjectToModify) return;
          clientObjectToModify.client.cache.evict({ id: key });
        }
        callback();
      }
    );
  }

  private getCache(client: ApolloClient<NormalizedCacheObject>) {
    return client.cache.extract(true);
  }

  private serializeCacheObjects = (clients: ApolloClientObject[]) =>
    clients.map(({ client, clientId }: ApolloClientObject) => ({
      clientId,
      cache: this.getCache(client),
    }));

  private cacheFetcherHandler() {
    if (!window.__APOLLO_CLIENTS__?.length) {
      return;
    }

    this.lastClientsArray = window.__APOLLO_CLIENTS__;
    this.publishCache(this.serializeCacheObjects(this.lastClientsArray));
  }

  public publishCache(cacheObjects: ClientCacheObject[]) {
    this.apolloPublisher.ns("apollo-cache").publish(cacheObjects);
  }
}
