import * as React from "react";
import {
  Accordion,
  Button,
  TabList,
  Tab,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
} from "@fluentui/react-components";
import { useStyles } from "./operations-tracker-styles";
import { IOperation } from "apollo-inspector";

const spaceForStringify = 2;

interface IOperationViewRendererProps {
  operation: IOperation;
}

interface IOperationViewContainer {
  operations: IOperation[] | null;
}

export const OperationViewContainer = (props: IOperationViewContainer) => {
  const { operations } = props;
  if (!operations) return null;

  const classes = useStyles();
  const [selectedOperation, setSelectedOperation] = React.useState({
    operation: operations[0],
    index: 0,
  });

  const onClickListItem = React.useCallback(
    (...args) => {
      setSelectedOperation({
        operation: operations[args[1].index],
        index: args[1].index,
      });
    },
    [operations, setSelectedOperation],
  );

  const items = React.useMemo(
    () =>
      operations.map((op, index) => (
        <Tab key={index} value={index}>
          {op.operationName}
          {op.operationType}
        </Tab>
      )),
    [operations, onClickListItem],
  );

  return (
    <div>
      <div className={classes.header}>{`Total count is: ${items.length}`}</div>
      <Button>{"Copy all operation"}</Button>
      <div>
        <div>
          <TabList defaultSelectedValue="tab2" vertical>
            {...items}
          </TabList>

          <OperationViewRenderer operation={selectedOperation.operation} />
        </div>
      </div>
    </div>
  );
};

const OperationViewRenderer = (props: IOperationViewRendererProps) => {
  const classes = useStyles();
  const { operationName, operationString, operationType, result, variables } =
    props.operation || {};

  if (!props.operation) {
    return <></>;
  }

  return (
    <div>
      <Button key={"copyBtn"}>{"Copy currentOperation"}</Button>
      <div className={classes.header}>{operationType}</div>
      <Accordion key={"accordion"}>
        <AccordionItem value="query">
          <AccordionHeader>{operationName}</AccordionHeader>
          <AccordionPanel>
            <div>{operationString}</div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="variables">
          <AccordionHeader>Variables</AccordionHeader>
          <AccordionPanel>
            <div>{JSON.stringify(variables, null, spaceForStringify)}</div>
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem value="result">
          <AccordionHeader>Result</AccordionHeader>
          <AccordionPanel>
            <div>{JSON.stringify(result, null, spaceForStringify)}</div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
