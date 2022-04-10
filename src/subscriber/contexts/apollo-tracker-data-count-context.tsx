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
  const [apolloTrackerDataCount, setApolloTrackerDataCount] =
    useState<ApolloTrackerDataCount>({ queriesCount: 0, mutationsCount: 0 });
  const myTool = useRef(rempl.getSubscriber());

  useEffect(() => {
    myTool.current
      .ns("apollo-tracker-data-count")
      .subscribe((data: ApolloTrackerDataCount) => {
        if (data) {
          setApolloTrackerDataCount(data);
        }
      });
  }, []);

  return (
    <ApolloTrackerDataCountContext.Provider value={apolloTrackerDataCount}>
      {children}
    </ApolloTrackerDataCountContext.Provider>
  );
};
