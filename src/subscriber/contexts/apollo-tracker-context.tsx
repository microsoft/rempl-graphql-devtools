import React, { useState} from "react";
import rempl from "rempl";
import { ApolloTrackerData } from "../../types";
import { updateData } from "../helpers";
import { ApolloTrackerContextData } from "../types";

export const ApolloTrackerContext =
  React.createContext<ApolloTrackerContextData>({});

export const ApolloClientDataWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [apolloTrackerData, setApolloTrackerData] =
    useState<ApolloTrackerContextData>({});
  const myTool = React.useRef(rempl.getSubscriber());

  React.useEffect(() => {
    myTool.current.ns("apollo-tracker").subscribe((data: ApolloTrackerData) => {
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
