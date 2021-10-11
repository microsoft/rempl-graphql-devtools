import React, { useState, useEffect } from "react";
import { ApolloTrackerData } from "../../types";
import { updateData } from "../helpers";
import { ApolloTrackerContextData } from "../types";
import rempl from "rempl";

export const ApolloTrackerContext = React.createContext<
  ApolloTrackerContextData[]
>([]);

export const ApolloClientDataWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [apolloTrackerData, setApolloTrackerData] = useState<
    ApolloTrackerContextData[]
  >([]);

  useEffect(() => {
    rempl
      .getSubscriber()
      .ns("apollo-tracker")
      .subscribe((data: ApolloTrackerData[]) => {
        if (data) {
          updateData(data, setApolloTrackerData);
        }
      });
  }, []);

  return (
    <ApolloTrackerContext.Provider value={apolloTrackerData}>
      {children}
    </ApolloTrackerContext.Provider>
  );
};
