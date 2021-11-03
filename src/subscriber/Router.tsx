import React, { useContext } from "react";
import { Menu } from "@fluentui/react-northstar";
import { MemoryRouter, Switch, Route, Link } from "react-router-dom";
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
  {
    key: "apollo-additional-informations",
    content: (
      <Link to="apollo-additional-informations">Additional Informations</Link>
    ),
  },
  {
    key: "graphiql",
    content: <Link to="graphiql">GraphiQL</Link>,
  },
];

const getCacheDataCount = (
  cacheContextData: ApolloCacheContextType,
  activeClientId: string
) => {
  if (!cacheContextData || !cacheContextData?.cacheObjects[activeClientId])
    return 0;

  return Object.keys(cacheContextData.cacheObjects[activeClientId].cache)
    .length;
};

const Router = () => {
  const apolloTrackerData = useContext(ApolloTrackerContext);
  const activeClientId = useContext(ActiveClientContext);
  const cacheData = useContext(ApolloCacheContext);

  const { mutationLog, watchedQueries } = apolloTrackerData[activeClientId];

  return (
    <MemoryRouter>
      <div>
        <Menu
          defaultActiveIndex={0}
          items={items(
            getCacheDataCount(cacheData, activeClientId),
            mutationLog.count,
            watchedQueries.count
          )}
          primary
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
};

export default Router;
