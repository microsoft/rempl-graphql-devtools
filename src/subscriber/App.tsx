import * as React from "react";
import { Provider, teamsTheme } from "@fluentui/react-northstar";
import Router from "./Router";
import { ApolloClientDataWrapper } from "./contexts/apollo-tracker-context";
import { ApolloGlobalOperationsWrapper } from "./contexts/apollo-global-operations-context";
import { ActiveClientContextWrapper } from "./contexts/active-client-context";
import { ApolloCacheContextWrapper } from "./contexts/apollo-cache-context";
import jss from "jss";
import preset from "jss-preset-default";
import { SheetsRegistry, JssProvider } from "react-jss";

const App = () => {
  const setupJss = () => {
    jss.setup(preset());
    const sheetsRegistry = new SheetsRegistry();
    const globalStyleSheet = jss
      .createStyleSheet({
        "@global": {
          html: { height: "100%" },
          body: { height: "100%", overflow: "hidden" },
          ".ui-provider": { height: "100%" },
        },
      })
      .attach();
    sheetsRegistry.add(globalStyleSheet);
    return sheetsRegistry;
  };

  const sheets = setupJss();

  return (
    <Provider theme={teamsTheme}>
      <JssProvider registry={sheets}>
        <ApolloGlobalOperationsWrapper>
          <ApolloClientDataWrapper>
            <ApolloCacheContextWrapper>
              <ActiveClientContextWrapper>
                <Router />
              </ActiveClientContextWrapper>
            </ApolloCacheContextWrapper>
          </ApolloClientDataWrapper>
        </ApolloGlobalOperationsWrapper>
      </JssProvider>
    </Provider>
  );
};

export default App;
