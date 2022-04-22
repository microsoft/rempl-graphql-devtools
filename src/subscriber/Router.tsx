import React, { useContext } from "react";
import { MemoryRouter, Switch, Route } from "react-router-dom";
import { ApolloCache } from "./apollo-cache";
import { WatchedQueries, Mutations } from "./apollo-tracker";
import { ApolloTrackerContext } from "./contexts/apollo-tracker-context";
import { AdditionalInformations } from "./apollo-additional-informations";
import { GraphiQLRenderer } from "./graphiql";
import { ActiveClientContext } from "./contexts/active-client-context";
import {
  ApolloCacheContext,
  ApolloCacheContextType,
} from "./contexts/apollo-cache-context";
import { Menu } from "../components";

const getCacheDataCount = (
  cacheContextData: ApolloCacheContextType,
  activeClientId: string
) => {
  if (!cacheContextData || !cacheContextData?.cacheObjects[activeClientId])
    return 0;

  return Object.keys(cacheContextData.cacheObjects[activeClientId].cache)
    .length;
};

const shouldShowLoader = (apolloTrackerData, activeClientId, cacheData) => {
  return !(
    Object.keys(apolloTrackerData).length &&
    cacheData?.cacheObjects &&
    activeClientId
  );
};

const Router = React.memo(() => {
  const apolloTrackerData = useContext(ApolloTrackerContext);
  const activeClientId = useContext(ActiveClientContext);
  const cacheData = useContext(ApolloCacheContext);

  if (shouldShowLoader(apolloTrackerData, activeClientId, cacheData))
    return <p>Loading...</p>;

  const { mutationLog, watchedQueries } = apolloTrackerData[activeClientId];

  return (
    <MemoryRouter>
      <div style={{display: "flex", height: 'calc(100% - 40px)'}}>
        <Menu
          cacheCount={getCacheDataCount(cacheData, activeClientId)}
          mutationsCount={mutationLog.count}
          queriesCount={watchedQueries.count}
        />
        <Switch>
          <Route path="/apollo-additional-informations">
            <AdditionalInformations />
          </Route>
          <Route path="/apollo-queries">
            <WatchedQueries />
          </Route>
          <Route path="/apollo-mutations">
            <Mutations />
          </Route>
          <Route path="/graphiql">
            <GraphiQLRenderer />
          </Route>
          <Route path="/">
            <ApolloCache />
          </Route>
        </Switch>
      </div>
    </MemoryRouter>
  );
});

export default Router;
