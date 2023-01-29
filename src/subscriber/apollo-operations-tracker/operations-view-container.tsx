import * as React from "react";
import { TabList, Tab } from "@fluentui/react-components";
import { IDataView } from "apollo-inspector";
import { TabHeaders } from "../../types";
import { VerboseOperationsViewRenderer } from "./verbose-operations-view-renderer";

export interface IOperationViewRendererProps {
  data: IDataView;
  selectedTab: TabHeaders;
}

export interface IOperationViewContainer {
  data: IDataView | null;
}

const tabHeaders = [
  { key: TabHeaders.AllOperationsView, name: "All operations" },
  { key: TabHeaders.OperationsView, name: "Only Cache operations" },
  { key: TabHeaders.VerboseOperationView, name: "Verbose operations" },
  { key: TabHeaders.AffectedQueriesView, name: "Affected Queries" },
];

export const OperationsViewContainer = (props: IOperationViewContainer) => {
  const { data } = props;
  const [selectedTab, setSelectedTab] = React.useState(
    TabHeaders.VerboseOperationView,
  );

  if (!data) return null;

  const updatedTabItems = React.useMemo(() => {
    const newTabHeaders = tabHeaders.filter(
      (tabHeader) => tabHeader.key === TabHeaders.VerboseOperationView,
    );
    return newTabHeaders;
  }, []);

  const tabs = React.useMemo(() => {
    const items = updatedTabItems.map((item) => {
      return (
        <Tab key={item.key} value={item.key}>
          {item.name}
        </Tab>
      );
    });
    return items;
  }, [updatedTabItems]);

  const onTabSelect = React.useCallback((_, value) => {
    setSelectedTab(value);
  }, []);

  return (
    <>
      <TabList
        defaultSelectedValue={updatedTabItems[0].key}
        onTabSelect={onTabSelect}
      >
        {tabs}
      </TabList>
      <OperationViewRenderer data={data} selectedTab={selectedTab} />
    </>
  );
};

const OperationViewRenderer = (props: IOperationViewRendererProps) => {
  const { selectedTab, data } = props;

  switch (selectedTab) {
    case TabHeaders.VerboseOperationView: {
      return (
        <VerboseOperationsViewRenderer operations={data.verboseOperations} />
      );
    }

    default: {
      return null;
    }
  }
};
