import { NormalizedCacheObject, ApolloClient } from "@apollo/client";
import { RemplWrapper } from "../rempl-wrapper";
import sizeOf from "object-sizeof";
import {
  ClientCacheObject,
  ClientRecentCacheObject,
  ClientObject,
} from "../../types";

export class ApolloCachePublisher {
  private static _instance: ApolloCachePublisher;
  private apolloPublisher;
  private remplWrapper: RemplWrapper;
  private recentCacheHistory: ClientRecentCacheObject = {};
  private lastCacheHistory: ClientCacheObject | null = null;
  private activeClient: ClientObject | null = null;
  private recordRecentCache = false;

  constructor(remplWrapper: RemplWrapper, apolloPublisher: any) {
    if (ApolloCachePublisher._instance) {
      return ApolloCachePublisher._instance;
    }

    this.remplWrapper = remplWrapper;
    this.remplWrapper.subscribeToRemplStatus(
      "apollo-cache",
      this.cachePublishHandler.bind(this),
      1500
    );
    this.apolloPublisher = apolloPublisher;
    this.attachMethodsToPublisher();

    ApolloCachePublisher._instance = this;
  }

  private attachMethodsToPublisher() {
    this.apolloPublisher.provide(
      "removeCacheKey",
      ({ key }: { key: string }, callback: () => void) => {
        if (this.activeClient) {
          this.activeClient.client.cache.evict({ id: key });
        }
        callback();
      }
    );
    this.apolloPublisher.provide(
      "clearRecent",
      (_: any, callback: () => void) => {
        this.recentCacheHistory = {};
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

  private getRecentCache(cache: NormalizedCacheObject) {
    const recentCacheClient = this.recentCacheHistory;
    if (!this.recordRecentCache) {
      return recentCacheClient ? recentCacheClient : {};
    }
    if (!recentCacheClient) {
      this.recentCacheHistory = {};
      return {};
    }
    const cacheClientFromLastIteration = this.lastCacheHistory;
    if (!cacheClientFromLastIteration) {
      return {};
    }

    this.recentCacheHistory = {
      ...recentCacheClient,
      ...this.diffCaches(cache, cacheClientFromLastIteration.cache),
    };

    return this.recentCacheHistory;
  }

  private serializeCacheObject = (client?: ClientObject) => {
    if (!client) {
      return;
    }

    const cache = this.getCache(client.client);
    return {
      cache,
      recentCache: this.getRecentCache(cache),
    };
  };

  private cachePublishHandler(
    clientObjects: ClientObject[],
    activeClient: ClientObject | null
  ) {
    if (!activeClient) {
      return;
    }

    if (this.activeClient?.clientId !== activeClient.clientId) {
      this.recentCacheHistory = {};
      this.lastCacheHistory = null;
    }
    this.activeClient = activeClient;

    const serializedCacheObject = this.serializeCacheObject(activeClient);

    if (!serializedCacheObject) {
      return;
    }

    if (sizeOf(this.lastCacheHistory) === sizeOf(serializedCacheObject)) {
      return;
    }
    this.lastCacheHistory = serializedCacheObject;
    this.publishCache(serializedCacheObject);
  }

  public publishCache(cacheObject: ClientCacheObject) {
    this.apolloPublisher.ns("apollo-cache").publish(cacheObject);
    this.apolloPublisher
      .ns("apollo-cache-count")
      .publish(Object.values(cacheObject).length);
  }
}
