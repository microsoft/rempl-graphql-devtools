import React, { useState, useContext, useMemo } from "react";
import { ApolloTrackerContext } from "../../contexts/apollo-tracker-context";
import { ApolloGlobalOperationsContext } from "../../contexts/apollo-global-operations-context";
import { ActiveClientContext } from "../../contexts/active-client-context";
import { List, VerticalViewer } from "../../../components";
import { WatchedQuery } from "../../types";
import { watchedQueriesStyles } from "./watched-queries.styles";
import { Text } from "@fluentui/react-components";

export const WatchedQueries = () => {
  const [selected, setSelected] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const apolloTrackerData = useContext(ApolloTrackerContext);
  const activeClient = useContext(ActiveClientContext);
  const globalOperations = useContext(ApolloGlobalOperationsContext);

  const data = apolloTrackerData[activeClient];
  const watchedQuery = data.watchedQueries.queries.find(
    ({ id }) => id === selected
  );
  const globalQueries = useMemo(
    () => new Set(globalOperations.globalQueries),
    [globalOperations]
  );
  const classes = watchedQueriesStyles();

  if (!watchedQuery) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.innerContainer}>
        <List
          isExpanded={isExpanded}
          items={data.watchedQueries.queries
            .map(({ name, id, errorMessage }: WatchedQuery) => ({
              index: id,
              key: `${name}-${id}`,
              onClick: () => setSelected(id),
              content: (
                <>
                  <Text
                    weight={id === selected ? "semibold" : "regular"}
                  >{name}</Text>
                  {globalQueries.has(name) && (
                    <Text weight="semibold">{" (GO)"}</Text>
                  )}
                  {errorMessage && (
                    <Text
                      className={!!errorMessage ? classes.error : ""}
                      weight={"semibold"}
                    >{" (ERROR)"}</Text>
                  )}
                </>
              )
            }))
            .reverse()}
          selectedIndex={selected}
        />
        <VerticalViewer
          data={watchedQuery}
          isExpanded={isExpanded}
          onExpand={() => setIsExpanded(!isExpanded)}
        />
      </div>
    </div>
  );
};
