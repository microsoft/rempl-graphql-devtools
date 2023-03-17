import * as React from "react";
import { IVerboseOperation } from "apollo-inspector";
import { useStyles } from "./verbose-operations-list-view-styles";
import { VerboseOperationView } from "./verbose-operation-view";
import { DataGridView } from "./data-grid-view";
import { IReducerAction } from "../operations-tracker-body/operations-tracker-body.interface";

export interface IVerboseOperationsContainerProps {
  operations: IVerboseOperation[] | null;
  searchText: string;
  dispatchOperationsCount: React.Dispatch<IReducerAction>;
  updateOperations: ({
    operations,
    filteredOperations,
  }: {
    operations: IVerboseOperation[];
    filteredOperations: IVerboseOperation[];
  }) => void;
}

export const VerboseOperationsContainer = (
  props: IVerboseOperationsContainerProps,
) => {
  const { operations, searchText, dispatchOperationsCount, updateOperations } =
    props;
  const [selectedOperation, setSelectedOperation] =
    React.useState<IVerboseOperation>();
  const classes = useStyles();

  console.log(operations);

  return (
    <div className={classes.root}>
      <div className={classes.operations}>
        <DataGridView
          key={"OperationsDataGridView"}
          operations={operations}
          searchText={searchText}
          setSelectedOperation={setSelectedOperation}
          selectedOperation={selectedOperation}
          dispatchOperationsCount={dispatchOperationsCount}
          updateOperations={updateOperations}
        />

        <VerboseOperationView
          key={"VerboseOperationView"}
          operation={selectedOperation}
          setSelectedOperation={setSelectedOperation}
        />
      </div>
    </div>
  );
};
