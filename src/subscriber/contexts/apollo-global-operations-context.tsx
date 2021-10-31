import React, { useState, useEffect } from "react";
import { ApolloGlobalOperations } from "../../types";
import rempl from "rempl";

export const ApolloGlobalOperationsContext =
  React.createContext<ApolloGlobalOperations>({
    globalQueries: [],
    globalMutations: [],
    globalSubscriptions: [],
  });

export const ApolloGlobalOperationsWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [apolloGlobalOperations, setApolloGlobalOperations] =
    useState<ApolloGlobalOperations>({
      globalQueries: [],
      globalMutations: [],
      globalSubscriptions: [],
    });

  useEffect(() => {
    rempl
      .getSubscriber()
      .ns("apollo-global-operations")
      .subscribe((data: ApolloGlobalOperations) => {
        if (data) {
          console.log(data);
          setApolloGlobalOperations(data);
        }
      });
  }, []);

  return (
    <ApolloGlobalOperationsContext.Provider value={apolloGlobalOperations}>
      {children}
    </ApolloGlobalOperationsContext.Provider>
  );
};
