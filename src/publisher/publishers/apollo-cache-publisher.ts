import { ApolloClient } from "@apollo/client/core";
import { NormalizedCacheObject } from "@apollo/client/cache";
import { RemplWrapper } from "../rempl-wrapper";
import sizeOf from "object-sizeof";
import {
  ClientCacheObject,
  ClientRecentCacheObject,
  ApolloClientObject,
} from "../../types";

export class ApolloCachePublisher {
  private static _instance: ApolloCachePublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private clientsArray: null | ApolloClientObject[] = null;
  private recentCachesHistory: ClientRecentCacheObject = {};
  private lastCachesHistory: ClientCacheObject = {};
  private recordRecentCache = false;

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloCachePublisher._instance) {
      return ApolloCachePublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      this.cachePublishHander.bind(this)
    );
    this.apolloPublisher = apolloPublisher;
    this.attachMethodsToPublisher();

    ApolloCachePublisher._instance = this;
  }

  private attachMethodsToPublisher() {
    this.apolloPublisher.provide(
      "removeCacheKey",
      (
        { clientId: clientIdToModify, key }: { clientId: string; key: string },
        callback: () => void
      ) => {
        if (this.clientsArray) {
          const clientObjectToModify = this.clientsArray.find(
            ({ clientId }) => clientId === clientIdToModify
          );

          if (!clientObjectToModify) return;
          clientObjectToModify.client.cache.evict({ id: key });
        }
        callback();
      }
    );
    this.apolloPublisher.provide(
      "clearRecent",
      ({ clientId }: { clientId: string }, callback: () => void) => {
        this.recentCachesHistory[clientId] = {};
        callback();
      }
    );

    this.apolloPublisher.provide(
      "recordRecent",
      ({ shouldRecord }: { shouldRecord: boolean }, callback: () => void) => {
        this.recordRecentCache = shouldRecord;
        callback();
      }
    );
  }

  private getCache(client: ApolloClient<NormalizedCacheObject>) {
    return client.cache.extract(true);
  }

  private diffCaches(
    currentCache: NormalizedCacheObject,
    previousCache: NormalizedCacheObject
  ) {
    return Object.fromEntries(
      Object.entries(currentCache).filter(([key, value]) => {
        if (
          !previousCache[key] ||
          JSON.stringify(previousCache[key]) !== JSON.stringify(value)
        ) {
          return true;
        }
        return false;
      })
    );
  }

  private getRecentCache(cache: NormalizedCacheObject, clientId: string) {
    const recentCacheClient = this.recentCachesHistory[clientId];
    if (!this.recordRecentCache) {
      return recentCacheClient ? recentCacheClient : {};
    }
    if (!recentCacheClient) {
      this.recentCachesHistory[clientId] = {};
      return {};
    }
    const cacheClientFromLastIteration = this.lastCachesHistory[clientId];
    if (!cacheClientFromLastIteration) {
      return {};
    }

    this.recentCachesHistory[clientId] = {
      ...recentCacheClient,
      ...this.diffCaches(cache, cacheClientFromLastIteration.cache),
    };

    return this.recentCachesHistory[clientId];
  }

  private serializeCacheObjects = (clients: ApolloClientObject[]) =>
    clients.reduce((acc, { client, clientId }: ApolloClientObject) => {
      const cache = this.getCache(client);
      acc[clientId] = {
        cache,
        recentCache: this.getRecentCache(cache, clientId),
      };
      return acc;
    }, {} as ClientCacheObject);

  private cachePublishHander() {
    if (!window.__APOLLO_CLIENTS__?.length) {
      return;
    }

    this.clientsArray = window.__APOLLO_CLIENTS__;
    const serializedCacheObject = this.serializeCacheObjects(this.clientsArray);

    if (sizeOf(this.lastCachesHistory) === sizeOf(serializedCacheObject)) {
      return;
    }
    this.lastCachesHistory = serializedCacheObject;
    this.publishCache(serializedCacheObject);
  }

  public publishCache(cacheObjects: ClientCacheObject) {
    this.apolloPublisher.ns("apollo-cache").publish(cacheObjects);
  }
}
