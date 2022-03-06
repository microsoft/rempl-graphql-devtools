import { NormalizedCacheObject, StoreObject } from "@apollo/client/cache";
import isEqual from "lodash.isequal";
import { CacheDuplicates } from "../../types";

function getObjectTypeDuplicates(objectTypeItems: Record<string, StoreObject>) {
  const duplicateItems = [];
  const cacheItemKeys = new Set(Object.keys(objectTypeItems));

  for (const cacheItemKey of cacheItemKeys.values()) {
    const keySet: Set<string> = new Set();
    for (const cacheItemKey2 of cacheItemKeys.values()) {
      if (
        cacheItemKey !== cacheItemKey2 &&
        isEqual(objectTypeItems[cacheItemKey], objectTypeItems[cacheItemKey2])
      ) {
        keySet.add(cacheItemKey);
        keySet.add(cacheItemKey2);
        cacheItemKeys.delete(cacheItemKey2);
      }
    }

    if (cacheItemKeys.has(cacheItemKey)) {
      cacheItemKeys.delete(cacheItemKey);
    }
    if (keySet.size > 1) {
      const objectDuplicates = [];

      for (const value of keySet.values()) {
        objectDuplicates.push({ [value]: objectTypeItems[value] });
      }

      duplicateItems.push(objectDuplicates);
    }
  }

  return duplicateItems;
}

export function getClientCacheDuplicates(
  cache: NormalizedCacheObject
): CacheDuplicates {
  const groupedItems = groupByType(cache);
  const duplicateItems = [];
  for (const objectType of Object.keys(groupedItems)) {
    if (Object.keys(groupedItems[objectType]).length > 1) {
      const objectTypeDuplicates = getObjectTypeDuplicates(
        groupedItems[objectType] as Record<string, StoreObject>
      );

      if (objectTypeDuplicates.length) {
        duplicateItems.push(...objectTypeDuplicates);
      }
    }
  }

  return duplicateItems;
}

function groupByType(cache: NormalizedCacheObject) {
  const groupedItems: { [key: string]: StoreObject } = {};
  for (const cacheItemKey of Object.keys(cache)) {
    const objectType = cacheItemKey.split(":")[0];
    if (!groupedItems[objectType]) {
      groupedItems[objectType] = { [cacheItemKey]: cache[cacheItemKey] };
      continue;
    }
    groupedItems[objectType][cacheItemKey] = cache[cacheItemKey];
  }

  return groupedItems;
}
