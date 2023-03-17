import * as React from "react";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  Tooltip,
  Text,
  Button,
  Body1Strong,
} from "@fluentui/react-components";
import {
  IOperationResult,
  IVerboseOperationDuration,
  IOperation,
} from "apollo-inspector";
import { useStyles, stylesKeys } from "./verbose-operation-view-styles";
import { OperationVariables, WatchQueryFetchPolicy } from "@apollo/client";
import {
  getOperationName,
  isNumber,
} from "../utils/apollo-operations-tracker-utils";
import { DocumentNode } from "graphql";
import { ResultsFrom } from "../../../types";

const spaceForStringify = 2;

interface IVerboseOperationViewProps {
  operation: IOperation | undefined;
  setSelectedOperation: React.Dispatch<
    React.SetStateAction<IOperation | undefined>
  >;
}

export const VerboseOperationView = (props: IVerboseOperationViewProps) => {
  const classes = useStyles();
  const { operation, setSelectedOperation } = props;
  if (!operation) {
    return <></>;
  }

  const { operationType, operationName } = operation;

  const accordionItems = React.useMemo(
    () => getAccordionItems(operation, classes),
    [operation, classes],
  );

  const closePreview = React.useCallback(() => {
    setSelectedOperation(undefined);
  }, [setSelectedOperation]);

  if (!operation) {
    return null;
  }

  return (
    <div className={classes.operationView}>
      <div className={classes.subHeading}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3 key="operationType">{`${operationType} : `}&nbsp;</h3>
          <Body1Strong underline>{operationName}</Body1Strong>
        </div>
        <Button
          size="small"
          className={classes.closeButton}
          onClick={closePreview}
          appearance="primary"
        >
          Close
        </Button>
      </div>
      <Accordion
        className={classes.operationDetails}
        key={"operationnViewAccordionn"}
        multiple
        collapsible
      >
        {...accordionItems}
      </Accordion>
    </div>
  );
};

const getAccordionItems = (
  operation: IOperation,
  classes: Record<stylesKeys, string>,
) => {
  const { operationName, operationString, result, variables, error } =
    operation;
  const items = [];

  items.push(getOperationNamePanel(operationName, operationString, classes));
  items.push(getVariablesPanel(variables, classes));
  items.push(getResultPanel(undefined, result, classes));
  error && items.push(getErrorPanel(error, classes));

  return items;
};

const getOperationNamePanel = (
  operationName: string | undefined,
  operationString: string,
  classes: Record<stylesKeys, string>,
) => {
  return (
    <AccordionItem
      style={{ color: "white" }}
      value="operationName"
      key="operationName"
    >
      <AccordionHeader>
        <Text style={{ fontWeight: "bold" }}>{operationName}</Text>
      </AccordionHeader>
      <AccordionPanel>
        <div className={classes.operationNameAccPanel}>{operationString}</div>
      </AccordionPanel>
    </AccordionItem>
  );
};

const getVariablesPanel = (
  variables: OperationVariables | undefined,
  classes: Record<stylesKeys, string>,
) => (
  <AccordionItem style={{ color: "white" }} value="variables" key="variables">
    <Tooltip content={"Variables for the operation"} relationship="label">
      <AccordionHeader>
        <Text style={{ fontWeight: "bold" }}>{"Variables"}</Text>
      </AccordionHeader>
    </Tooltip>
    <AccordionPanel>
      <div className={classes.operationVariablesAccPanel}>
        {JSON.stringify(variables, null, spaceForStringify)}
      </div>
    </AccordionPanel>
  </AccordionItem>
);

const getResultPanel = (
  isOptimistic: boolean | undefined,
  result: unknown | undefined,
  classes: Record<stylesKeys, string>,
) => {
  const items = [
    <AccordionItem value={result}>
      <AccordionHeader>
        <Text style={{ fontWeight: "bold" }}>{result}</Text>
      </AccordionHeader>
      <AccordionPanel>
        <div className={classes.resultPanel}>
          {`${JSON.stringify(result, null, spaceForStringify)}`}
        </div>
      </AccordionPanel>
    </AccordionItem>,
  ];

  return (
    <AccordionItem style={{ color: "white" }} value="result" key="result">
      <Tooltip
        content={
          "Data/result of the operation, whether its from cache or network"
        }
        relationship="label"
      >
        <AccordionHeader>
          <Text style={{ fontWeight: "bold" }}>{`Result ${
            isOptimistic ? "(Optimistic result)" : ""
          }`}</Text>
        </AccordionHeader>
      </Tooltip>
      <AccordionPanel>
        <Accordion collapsible>{...items}</Accordion>
      </AccordionPanel>
    </AccordionItem>
  );
};

const getErrorPanel = (error: unknown, classes: Record<stylesKeys, string>) => (
  <AccordionItem style={{ color: "white" }} value="errorPanel" key="errorPanel">
    <Tooltip
      content={"Error message for operation failure"}
      relationship="label"
    >
      <AccordionHeader>
        <Text style={{ fontWeight: "bold" }}>{`Error ${
          error ? "(failed)" : ""
        }`}</Text>
      </AccordionHeader>
    </Tooltip>
    <AccordionPanel>
      <div className={classes.errorAccPanel}> {JSON.stringify(error)}</div>
    </AccordionPanel>
  </AccordionItem>
);
