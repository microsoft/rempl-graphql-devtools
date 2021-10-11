import React from "react";
import { ApolloCacheRenderer } from "./apollo-cache-renderer";
import sizeOf from "object-sizeof";
import { NormalizedCacheObject } from "@apollo/client/cache";

interface IApolloCacheContainer {
  cache: NormalizedCacheObject;
  removeCacheItem: (key: string) => void;
}

const ApolloCacheContainer = ({
  cache,
  removeCacheItem,
}: IApolloCacheContainer) => {
  const cacheObjectsWithSize = getCacheObjectWithSizes(cache as any);

  return (
    <ApolloCacheRenderer
      cacheObjectsWithSize={cacheObjectsWithSize}
      cacheSize={sizeOf(cache as any)}
      removeCacheItem={removeCacheItem}
    />
  );
};

function getCacheObjectWithSizes(rawCache?: Record<string, any>) {
  if (!rawCache) {
    return [];
  }

  const cacheKeys = Object.keys(rawCache);

  return cacheKeys.sort().map((key: string) => ({
    key,
    valueSize: sizeOf(rawCache[key]),
    value: rawCache[key],
  }));
}

export default ApolloCacheContainer;
