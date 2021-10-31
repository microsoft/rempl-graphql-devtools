import React, { useState, useContext } from "react";
import { MutationViewer } from "./mutation-viewer";
import { Box, List, Flex, Segment } from "@fluentui/react-northstar";
import { ActiveClientContext } from "../../contexts/active-client-context";
import { ApolloTrackerContext } from "../../contexts/apollo-tracker-context";

export const Mutations = () => {
  const [selected, setSelected] = useState<number>(0);
  const apolloTrackerData = useContext(ApolloTrackerContext);
  const activeClient = useContext(ActiveClientContext);

  const data = apolloTrackerData[activeClient];
  const mutation = data.mutationLog.mutations.find(({ id }) => id === selected);

  if (!mutation) {
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
            items={data.mutationLog.mutations
              .map(({ name, id }: { name: string; id: number }) => ({
                key: `${name}-${id}`,
                onClick: () => setSelected(id),
                content: name,
                truncate: true,
              }))
              .reverse()}
          />
        </Box>
      </Flex.Item>
      <Flex.Item size="size.large" grow>
        <Box>
          <h3>{mutation.name} (Mutation)</h3>
          <Segment>
            <MutationViewer
              mutationString={mutation.mutationString}
              variables={mutation.variables}
            />
          </Segment>
        </Box>
      </Flex.Item>
    </Flex>
  );
};
