import * as React from "react";
import { Provider, teamsTheme } from "@fluentui/react-northstar";
import Router from "./Router";
import { ApolloClientDataWrapper } from "./contexts/apollo-tracker-context";
import { ActiveClientContextWrapper } from "./contexts/active-client-context";
import { ApolloCacheContextWrapper } from "./contexts/apollo-cache-context";

const App = () => {
  return (
    <Provider theme={teamsTheme}>
      <ApolloClientDataWrapper>
        <ApolloCacheContextWrapper>
          <ActiveClientContextWrapper>
            <Router />
          </ActiveClientContextWrapper>
        </ApolloCacheContextWrapper>
      </ApolloClientDataWrapper>
    </Provider>
  );
};

export default App;
