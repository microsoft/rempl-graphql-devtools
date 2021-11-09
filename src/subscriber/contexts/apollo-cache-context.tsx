import React from "react";
import { NormalizedCacheObject } from "@apollo/client/cache";
import { ClientCacheObject } from "../../types";
import rempl from "rempl";

export type ApolloCacheContextType = {
  removeCacheItem: (clientIdToModify: string) => (key: string) => void;
  recordRecentCacheChanges: (
    clientIdToModify: string
  ) => (shouldRecord: boolean) => void;
  clearRecentCacheChanges: (clientIdToModify: string) => () => void;
  cacheObjects: ClientCacheObject;
} | null;

export const ApolloCacheContext =
  React.createContext<ApolloCacheContextType>(null);

export const ApolloCacheContextWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [cacheObjects, setCacheObjects] = React.useState<ClientCacheObject>({});
  const myTool = React.useRef(rempl.getSubscriber());

  React.useEffect(() => {
    myTool.current
      .ns("apollo-cache")
      .subscribe(function (data: ClientCacheObject) {
        if (data) {
          setCacheObjects(data);
        }
      });
  }, []);

  const removeCacheItem = React.useCallback(
    (clientIdToModify: string) => (key: string) => {
      const cacheObjectsToModify = { ...cacheObjects };
      cacheObjectsToModify[clientIdToModify] = {
        ...cacheObjects[clientIdToModify],
        cache: removeKeyFromCacheState(
          key,
          cacheObjects[clientIdToModify].cache
        ),
      };

      setCacheObjects(cacheObjectsToModify);
      myTool.current.callRemote("removeCacheKey", {
        key,
        clientId: clientIdToModify,
      });
    },
    [cacheObjects]
  );

  const clearRecentCacheChanges = React.useCallback(
    (clientIdToModify: string) => () => {
      const cacheObjectsToModify = { ...cacheObjects };
      cacheObjectsToModify[clientIdToModify] = {
        ...cacheObjects[clientIdToModify],
        recentCache: {},
      };

      setCacheObjects(cacheObjectsToModify);
      myTool.current.callRemote("clearRecent", {
        clientId: clientIdToModify,
      });
    },
    [cacheObjects]
  );

  const recordRecentCacheChanges = React.useCallback(
    (clientIdToModify: string) => (shouldRecord: boolean) => {
      myTool.current.callRemote("recordRecent", {
        clientId: clientIdToModify,
        shouldRecord,
      });
    },
    [cacheObjects]
  );

  return (
    <ApolloCacheContext.Provider
      value={{
        cacheObjects,
        removeCacheItem,
        clearRecentCacheChanges,
        recordRecentCacheChanges,
      }}
    >
      {children}
    </ApolloCacheContext.Provider>
  );
};

function removeKeyFromCacheState(
  key: string,
  cacheState: NormalizedCacheObject
): NormalizedCacheObject {
  return Object.keys(cacheState)
    .filter((cacheKey: string) => cacheKey !== key)
    .reduce((acc: NormalizedCacheObject, key: string) => {
      acc[key] = cacheState[key];
      return acc;
    }, {});
}
