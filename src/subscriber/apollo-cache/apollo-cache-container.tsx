import React, { useContext, useMemo } from "react";
import { ApolloCacheRenderer } from "./apollo-cache-renderer";
import sizeOf from "object-sizeof";
import { ApolloCacheContext } from "../contexts/apollo-cache-context";
import { ActiveClientContext } from "../contexts/active-client-context";
import { CacheObjectWithSize } from "./types";

const ApolloCacheContainer = React.memo(() => {
  const contextData = useContext(ApolloCacheContext);
  const activeClientId = useContext(ActiveClientContext);

  if (!contextData) return null;

  const {
    cacheObjects,
    removeCacheItem,
    recordRecentCacheChanges,
    clearRecentCacheChanges,
  } = contextData;

  const cache = cacheObjects[activeClientId].cache;
  const recentCache = cacheObjects[activeClientId].recentCache;
  const cacheObjectsWithSize = useMemo(
    () => getCacheObjectWithSizes(cache as Record<string, unknown>),
    [cache]
  );

  const recentCacheObjectsWithSize = useMemo(
    () => getCacheObjectWithSizes(recentCache as Record<string, unknown>),
    [recentCache]
  );

  return (
    <ApolloCacheRenderer
      cacheObjectsWithSize={cacheObjectsWithSize}
      recentCacheWithSize={recentCacheObjectsWithSize}
      clearRecentCacheChanges={clearRecentCacheChanges(activeClientId)}
      recordRecentCacheChanges={recordRecentCacheChanges(activeClientId)}
      cacheSize={sizeOf(cache as Record<string, unknown>)}
      removeCacheItem={removeCacheItem(activeClientId)}
    />
  );
});

function getCacheObjectWithSizes(rawCache?: Record<string, unknown>) {
  if (!rawCache) {
    return [];
  }

  const cacheKeys = Object.keys(rawCache);

  return cacheKeys.sort().map((key: string) => ({
    key,
    valueSize: sizeOf(rawCache[key]),
    value: rawCache[key],
  })) as CacheObjectWithSize[];
}

export default ApolloCacheContainer;
