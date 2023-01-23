import { IDataView } from "apollo-inspector";
import React, { useEffect, useState, createContext, useMemo } from "react";
import { remplSubscriber } from "../rempl";
import { ApolloOperationsTracker } from "../../types";

export const defaultApolloOperationsTracker: ApolloOperationsTracker = {
  data: undefined,
  setApolloOperationsData: undefined,
};

export const ApolloOperationsTrackerContext =
  createContext<ApolloOperationsTracker>(defaultApolloOperationsTracker);

export const ApolloOperationTrackerContextWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [apollOperationsData, setApolloOperationsData] =
    useState<IDataView | null>(null);

  useEffect(() => {
    remplSubscriber
      .ns("apollo-operations-tracker")
      .subscribe((data: IDataView) => {
        setApolloOperationsData(data);
      });
  }, []);

  const providerValue = useMemo(
    () =>
      ({
        data: apollOperationsData,
        setApolloOperationsData,
      } as ApolloOperationsTracker),
    [apollOperationsData, setApolloOperationsData],
  );

  return (
    <ApolloOperationsTrackerContext.Provider value={providerValue}>
      {children}
    </ApolloOperationsTrackerContext.Provider>
  );
};
