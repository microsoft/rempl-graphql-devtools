import React, { useState, useContext, useMemo } from "react";
import { Flex, Text } from "@fluentui/react-northstar";
import { ApolloTrackerContext } from "../../contexts/apollo-tracker-context";
import { ApolloGlobalOperationsContext } from "../../contexts/apollo-global-operations-context";
import { ActiveClientContext } from "../../contexts/active-client-context";
import { List, VerticalViewer } from "../../../components";
import { useAutoContainerHeight } from "../../../helpers/container-height";

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
  const headerHeight = useAutoContainerHeight();
  const globalQueries = useMemo(
    () => new Set(globalOperations.globalQueries),
    [globalOperations]
  );

  if (!watchedQuery) {
    return null;
  }

  return (
    <Flex styles={{ height: `calc(100% - ${headerHeight}px)` }}>
      <List
        isExpanded={isExpanded}
        items={data.watchedQueries.queries
          .map(({ name, id }: { name: string; id: number }) => ({
            index: id,
            key: `${name}-${id}`,
            onClick: () => setSelected(id),
            content: (
              <>
                <Text
                  weight={id === selected ? "bold" : "regular"}
                  content={name}
                />
                {globalQueries.has(name) && (
                  <Text weight={"bold"} content={" (GO)"} />
                )}
              </>
            ),
            truncate: true,
          }))
          .reverse()}
        selectedIndex={selected}
      />
      <VerticalViewer
        data={watchedQuery}
        isExpanded={isExpanded}
        onExpand={() => setIsExpanded(!isExpanded)}
      />
    </Flex>
  );
};
