import React, { useContext } from "react";
import ApolloCacheContainer from "./apollo-cache-container";
import { ClientCacheObject } from "../../types";
import {
  ApolloCacheContext,
  getCacheObjectByClientId,
} from "../contexts/apollo-cache-context";
import { ActiveClientContext } from "../contexts/active-client-context";

const ApolloCacheObjects = () => {
  const { cacheObjects, removeCacheItem } = useContext(ApolloCacheContext);
  const activeClientId = useContext(ActiveClientContext);

  return (
    <ApolloCacheContainer
      removeCacheItem={removeCacheItem(activeClientId)}
      cache={getCacheObjectByClientId(cacheObjects, activeClientId).cache}
    />
  );
};

export default ApolloCacheObjects;
