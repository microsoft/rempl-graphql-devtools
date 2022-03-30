import React, { useMemo, useState, useContext } from "react";
import { ActiveClientContext } from "../../contexts/active-client-context";
import { ApolloTrackerContext } from "../../contexts/apollo-tracker-context";
import { List, VerticalViewer } from "../../../components";
import { ApolloGlobalOperationsContext } from "../../contexts/apollo-global-operations-context";
import { Mutation } from "../../types";
import { mutationsStyles } from "./mutations.styles";
import { Text } from "@fluentui/react-components";

export const Mutations = () => {
  const [selected, setSelected] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const apolloTrackerData = useContext(ApolloTrackerContext);
  const activeClient = useContext(ActiveClientContext);
  const globalOperations = useContext(ApolloGlobalOperationsContext);

  const classes = mutationsStyles();

  const data = apolloTrackerData[activeClient];
  const mutation = data.mutationLog.mutations.find(({ id }) => id === selected);
  const globalMutations = useMemo(
    () => new Set(globalOperations.globalMutations),
    [globalOperations]
  );

  if (!mutation) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.innerContainer}>
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
                    weight={id === selected ? "semibold" : "regular"}
                  >{name}</Text>
                  {globalMutations.has(name) && (
                    <Text weight="semibold">{" (GO)"}</Text>
                  )}
                  {errorMessage && (
                    <Text
                      weight="semibold"
                      className={!!errorMessage ? classes.error : ""}
                    >{" (ERROR)"}</Text>
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
      </div>
    </div>
  );
};
