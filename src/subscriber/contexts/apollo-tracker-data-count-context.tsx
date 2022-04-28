import React, { useState, useRef, useEffect } from "react";
import rempl from "rempl";
import { ApolloTrackerDataCount } from "../../types";

export const ApolloTrackerDataCountContext =
  React.createContext<ApolloTrackerDataCount>({
    mutationsCount: 0,
    queriesCount: 0,
  });

export const ApolloClientDataCountWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [apolloTrackerQueriesCount, setApolloTrackerQueriesCount] =
    useState<number>(0);

  const [apolloTrackerMutationsCount, setApolloTrackerMutationsCount] =
    useState<number>(0);
  const myTool = useRef(rempl.getSubscriber());

  useEffect(() => {
    myTool.current
      .ns("apollo-tracker-queries-count")
      .subscribe((data: number) => {
        if (data != null) {
          setApolloTrackerQueriesCount(data);
        }
      });

    myTool.current
      .ns("apollo-tracker-mutations-count")
      .subscribe((data: number) => {
        if (data != null) {
          setApolloTrackerMutationsCount(data);
        }
      });
  }, []);

  return (
    <ApolloTrackerDataCountContext.Provider
      value={{
        mutationsCount: apolloTrackerMutationsCount,
        queriesCount: apolloTrackerQueriesCount,
      }}
    >
      {children}
    </ApolloTrackerDataCountContext.Provider>
  );
};
