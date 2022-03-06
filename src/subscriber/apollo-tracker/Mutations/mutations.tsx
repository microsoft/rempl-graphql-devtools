import React, { useMemo, useState, useContext } from "react";
import { Flex, Text } from "@fluentui/react-northstar";
import { ActiveClientContext } from "../../contexts/active-client-context";
import { ApolloTrackerContext } from "../../contexts/apollo-tracker-context";
import { List, VerticalViewer } from "../../../components";
import { useAutoContainerHeight } from "../../../helpers/container-height";
import { ApolloGlobalOperationsContext } from "../../contexts/apollo-global-operations-context";
import { Mutation } from "../../types";

export const Mutations = () => {
  const [selected, setSelected] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const apolloTrackerData = useContext(ApolloTrackerContext);
  const activeClient = useContext(ActiveClientContext);
  const globalOperations = useContext(ApolloGlobalOperationsContext);

  const data = apolloTrackerData[activeClient];
  const mutation = data.mutationLog.mutations.find(({ id }) => id === selected);
  const headerHeight = useAutoContainerHeight();
  const globalMutations = useMemo(
    () => new Set(globalOperations.globalMutations),
    [globalOperations]
  );

  if (!mutation) {
    return null;
  }

  return (
    <Flex styles={{ height: `calc(100% - ${headerHeight}px)` }}>
      <List
        isExpanded={isExpanded}
        items={data.mutationLog.mutations
          .map(({ name, id, errorMessage }: Mutation) => ({
            index: id,
            key: `${name}-${id}`,
            onClick: () => setSelected(id),
            content: (
              <>
                <Text
                  weight={id === selected ? "bold" : "regular"}
                  content={name}
                />
                {globalMutations.has(name) && (
                  <Text weight={"bold"} content={" (GO)"} />
                )}
                {errorMessage && (
                  <Text
                    weight={"bold"}
                    error={!!errorMessage}
                    content={" (ERROR)"}
                  />
                )}
              </>
            ),
            truncate: true,
          }))
          .reverse()}
        selectedIndex={selected}
      />
      <VerticalViewer
        data={mutation}
        isExpanded={isExpanded}
        onExpand={() => setIsExpanded(!isExpanded)}
        isMutation
      />
    </Flex>
  );
};
