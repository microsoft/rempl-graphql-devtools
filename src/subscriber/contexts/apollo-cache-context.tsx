import React from "react";
import sizeOf from "object-sizeof";
import { NormalizedCacheObject } from "@apollo/client/cache";
import { ClientCacheObject } from "../../types";
import rempl from "rempl";

export const ApolloCacheContext = React.createContext<{
  removeCacheItem: (clientIdToModify: string) => (key: string) => void;
  cacheObjects: ClientCacheObject[];
} | null>(null);

export const ApolloCacheContextWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [cacheObjects, setCacheObjects] = React.useState<ClientCacheObject[]>(
    []
  );
  const myTool = React.useRef(rempl.getSubscriber());

  React.useEffect(() => {
    myTool.current.ns("apollo-cache").subscribe(function (data: any) {
      if (sizeOf(cacheObjects) !== sizeOf(data)) {
        setCacheObjects(data);
      }
    });
  }, []);

  const removeCacheItem = React.useCallback(
    (clientIdToModify: string) => (key: string) => {
      const cacheObjectsToModify = cacheObjects.reduce(
        (acc: ClientCacheObject[], { clientId, cache }: ClientCacheObject) => {
          if (clientId !== clientIdToModify) return acc;

          return [
            ...acc,
            { clientId, cache: removeKeyFromCacheState(key, cache) },
          ];
        },
        []
      );

      setCacheObjects(cacheObjectsToModify);
      myTool.current.callRemote("removeCacheKey", {
        key,
        clientId: clientIdToModify,
      });
    },
    [cacheObjects]
  );

  return (
    <ApolloCacheContext.Provider value={{ cacheObjects, removeCacheItem }}>
      {children}
    </ApolloCacheContext.Provider>
  );
};

export const getCacheObjectByClientId = (
  cacheObjects: ClientCacheObject[],
  activeClientId: string
) =>
  cacheObjects.find(
    (cacheObject: ClientCacheObject) => cacheObject.clientId === activeClientId
  ) as ClientCacheObject;

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
