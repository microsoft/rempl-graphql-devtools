import React, { useContext } from "react";
import { Menu } from "@fluentui/react-northstar";
import { MemoryRouter, Switch, Route, Link } from "react-router-dom";
import { ApolloCache } from "./apollo-cache";
import { WatchedQueries, Mutations } from "./apollo-tracker";
import { ApolloTrackerContext } from "./contexts/apollo-tracker-context";
import {
  ActiveClientContext,
  getActiveClientData,
} from "./contexts/active-client-context";
import {
  ApolloCacheContext,
  getCacheObjectByClientId,
} from "./contexts/apollo-cache-context";

const items = (
  cacheCount: number,
  mutationsCount: number,
  queriesCount: number
) => [
  {
    key: "apollo-cache",
    content: <Link to="/">{`Cache (${cacheCount})`}</Link>,
  },
  {
    key: "apollo-queries",
    content: (
      <Link to="apollo-queries">{`Watched Queries (${queriesCount})`}</Link>
    ),
  },
  {
    key: "apollo-mutations",
    content: (
      <Link to="apollo-mutations">{`Mutations (${mutationsCount})`}</Link>
    ),
  },
];

const Router = () => {
  const apolloTrackerData = useContext(ApolloTrackerContext);
  const activeClientId = useContext(ActiveClientContext);
  const { cacheObjects } = useContext(ApolloCacheContext);

  const { mutationLog, watchedQueries } = getActiveClientData(
    apolloTrackerData,
    activeClientId
  );

  const { cache } = getCacheObjectByClientId(cacheObjects, activeClientId);

  return (
    <MemoryRouter>
      <div>
        <Menu
          defaultActiveIndex={0}
          items={items(
            Object.keys(cache).length,
            mutationLog.count,
            watchedQueries.count
          )}
          primary
        />
        <Switch>
          <Route path="/apollo-queries">
            <WatchedQueries />
          </Route>
          <Route path="/apollo-mutations">
            <Mutations />
          </Route>
          <Route path="/">
            <ApolloCache />
          </Route>
        </Switch>
      </div>
    </MemoryRouter>
  );
};

export default Router;
