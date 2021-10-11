import React, { useState, useContext } from "react";
import { List, Flex, Segment, Box } from "@fluentui/react-northstar";
import { QueryViewer } from "./query-viewer";
import { ApolloTrackerContext } from "../../contexts/apollo-tracker-context";
import {
  ActiveClientContext,
  getActiveClientData,
} from "../../contexts/active-client-context";

export const WatchedQueries = () => {
  const [selected, setSelected] = useState<number>(0);
  const apolloTrackerData = useContext(ApolloTrackerContext);
  const activeClient = useContext(ActiveClientContext);

  const data = getActiveClientData(apolloTrackerData, activeClient);
  const watchedQuery = data.watchedQueries.queries.find(
    ({ id }) => id === selected
  );

  if (!watchedQuery) {
    return null;
  }

  return (
    <Flex gap="gap.small" padding="padding.medium">
      <Flex.Item size="size.small">
        <Box
          styles={{
            "max-height": "800px",
            minWidth: "220px",
            "overflow-y": "scroll",
            "overflow-x": "hidden",
          }}
        >
          <List
            selectable
            truncateContent
            styles={{ width: "220px" }}
            items={data.watchedQueries.queries
              .map(({ name, id }: { name: string; id: number }) => ({
                index: id,
                key: `${name}-${id}`,
                onClick: () => setSelected(id),
                content: name,
                truncate: true,
              }))
              .reverse()}
            selectedIndex={selected}
          />
        </Box>
      </Flex.Item>
      <Flex.Item size="size.large" grow>
        <Box>
          <h3>{watchedQuery.name} (Watched Query)</h3>
          <Segment>
            <QueryViewer
              queryString={watchedQuery.queryString}
              variables={watchedQuery.variables}
              cachedData={watchedQuery.cachedData}
            />
          </Segment>
        </Box>
      </Flex.Item>
    </Flex>
  );
};
