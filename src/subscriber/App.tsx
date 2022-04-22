import * as React from "react";
import Router from "./Router";
import { ApolloClientDataWrapper } from "./contexts/apollo-tracker-context";
import { ApolloGlobalOperationsWrapper } from "./contexts/apollo-global-operations-context";
import { ActiveClientContextWrapper } from "./contexts/active-client-context";
import { ApolloCacheContextWrapper } from "./contexts/apollo-cache-context";
import { ApolloCacheDuplicatesContextWrapper } from "./contexts/apollo-cache-duplicates-context";
import jss from "jss";
import preset from "jss-preset-default";
import { SheetsRegistry, JssProvider } from "react-jss";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

const App = () => {
  const setupJss = () => {
    jss.setup(preset());
    const sheetsRegistry = new SheetsRegistry();
    const globalStyleSheet = jss
      .createStyleSheet({
        "@global": {
          html: { height: "100%" },
          body: { height: "100%", overflow: "hidden", margin: 0, padding: 0, boxSizing: "border-box" },
        },
      })
      .attach();
    sheetsRegistry.add(globalStyleSheet);
    return sheetsRegistry;
  };

  const sheets = setupJss();

  return (
    <FluentProvider theme={teamsLightTheme} style={{height: '100%', backgroundColor: "#F2F2F2"}}>
      <JssProvider registry={sheets}>
        <ApolloGlobalOperationsWrapper>
          <ActiveClientContextWrapper>
            <ApolloClientDataWrapper>
              <ApolloCacheContextWrapper>
                <ApolloCacheDuplicatesContextWrapper>
                  <Router />
                </ApolloCacheDuplicatesContextWrapper>
              </ApolloCacheContextWrapper>
            </ApolloClientDataWrapper>
          </ActiveClientContextWrapper>
        </ApolloGlobalOperationsWrapper>
      </JssProvider>
    </FluentProvider>
  );
};

export default App;
