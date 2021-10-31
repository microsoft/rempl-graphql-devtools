import React from "react";
import { Table } from "@fluentui/react-northstar";
import { ApolloGlobalOperations } from "../../types";

const getTableRows = ({
  globalQueries,
  globalMutations,
  globalSubscriptions,
}: ApolloGlobalOperations) => {
  const biggestSize = Math.max(
    globalQueries.length,
    Math.max(globalMutations.length, globalSubscriptions.length)
  );
  const rows = [];
  for (let i = 0; i <= biggestSize; i++) {
    const globalSubscription = globalSubscriptions[i] || "";
    const globalQuery = globalQueries[i] || "";
    const globalMutation = globalMutations[i] || "";
    rows.push({
      key: i,
      items: [globalQuery, globalMutation, globalSubscription],
    });
  }
  return rows;
};

const AdditionalInformationsRenderer = ({
  globalOperations,
}: {
  globalOperations: ApolloGlobalOperations;
}) => {
  const header = {
    items: ["Global Queries", "Global Mutations", "Global Subscriptions"],
  };
  const rows = getTableRows(globalOperations);

  return <Table header={header} rows={rows} aria-label="Global Operations" />;
};

export default AdditionalInformationsRenderer;
