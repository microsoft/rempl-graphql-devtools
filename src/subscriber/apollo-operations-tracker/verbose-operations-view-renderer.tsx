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
import { IVerboseOperation } from "apollo-inspector";

export interface IVerboseOperationViewRendererProps {
  operations: IVerboseOperation[] | null;
}

const spaceForStringify = 2;

export const VerboseOperationsViewRenderer = (
  props: IVerboseOperationViewRendererProps,
) => {
  const { operations } = props;
  const [selectedOperation, setSelectedOperation] = React.useState(
    props.operations?.[0],
  );

  const tabListItems = React.useMemo(() => {
    const tabItems = operations?.map((op) => {
      return (
        <Tab key={op.id} value={op.id}>
          {op.operationName}
        </Tab>
      );
    });

    return tabItems;
  }, []);

  const onTabSelect = React.useCallback(
    (_, value) => {
      const asd = operations?.find((op) => op.id === value);
      setSelectedOperation(asd);
    },
    [setSelectedOperation],
  );

  return (
    <div>
      <TabList vertical defaultSelectedValue={0} onTabSelect={onTabSelect}>
        {tabListItems}
      </TabList>
      <VerboseOperationView operation={selectedOperation} />
    </div>
  );
};

interface IVerboseOperationViewProps {
  operation: IVerboseOperation | undefined;
}

const VerboseOperationView = (props: IVerboseOperationViewProps) => {
  const classes = useStyles();

  if (!props.operation) {
    return <></>;
  }

  const { operationName, operationString, operationType, result, variables } =
    props.operation;

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
