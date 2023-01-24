import * as React from "react";
import Router from "./Router";
import { ApolloClientMetadataWrapper } from "./contexts/apollo-tracker-metadata-context";
import { ApolloGlobalOperationsWrapper } from "./contexts/apollo-global-operations-context";
import { ActiveClientContextWrapper } from "./contexts/active-client-context";
import { ApolloCacheContextWrapper } from "./contexts/apollo-cache-context";
import { ApolloCacheDuplicatesContextWrapper } from "./contexts/apollo-cache-duplicates-context";
import { ApolloOperationTrackerContextWrapper } from "./contexts";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

const App = () => (
  <FluentProvider
    theme={teamsLightTheme}
    style={{ height: "100%", backgroundColor: "#F2F2F2" }}
  >
    <ApolloGlobalOperationsWrapper>
      <ActiveClientContextWrapper>
        <ApolloClientMetadataWrapper>
          <ApolloCacheContextWrapper>
            <ApolloOperationTrackerContextWrapper>
              <ApolloCacheDuplicatesContextWrapper>
                <Router />
              </ApolloCacheDuplicatesContextWrapper>
            </ApolloOperationTrackerContextWrapper>
          </ApolloCacheContextWrapper>
        </ApolloClientMetadataWrapper>
      </ActiveClientContextWrapper>
    </ApolloGlobalOperationsWrapper>
  </FluentProvider>
);

export default App;
