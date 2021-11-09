import React from "react";
import { Accordion, List } from "@fluentui/react-northstar";
import { ApolloGlobalOperations } from "../../types";
import { useAutoContainerHeight } from "../../helpers/container-height";
import { useStyles } from "./additional-info-styles";

const panels = (globalOperations: ApolloGlobalOperations) => [
  {
    key: "0_global_queries",
    title: {
      content: "Global Queries",
      style: {
        top: 0,
      },
    },
    content: {
      content: <List items={globalOperations.globalQueries} />,
    },
  },
  {
    key: "1_global_mutations",
    title: {
      content: "Global Mutations",
      style: {
        top: 31,
        bottom: 31,
      },
    },
    content: {
      content: <List items={globalOperations.globalMutations} />,
    },
  },
  {
    key: "2_global_subscriptions",
    title: {
      content: "Global Subscriptions",
      style: {
        top: 31 * 2,
        bottom: 0,
      },
    },
    content: {
      content: <List items={globalOperations.globalSubscriptions} />,
    },
  },
];

const AdditionalInformationsRenderer = React.memo(
  ({ globalOperations }: { globalOperations: ApolloGlobalOperations }) => {
    const classes = useStyles();
    const headerHeight = useAutoContainerHeight();
    return (
      <div
        className={classes.container}
        style={{ height: `calc(100% - ${headerHeight}px)` }}
      >
        <Accordion panels={panels(globalOperations)} />
      </div>
    );
  }
);

export default AdditionalInformationsRenderer;
