import { Provider, teamsTheme, Menu } from "@fluentui/react-northstar";
import { ApolloProvider } from "@apollo/client";
import { buildClient } from "data/data-builder";
import ApolloCacheContainer from "./apollo-cache/apollo-cache-container";

const App = () => {
  const client = buildClient();
  if ((window as any) && !(window as any).__APOLLO_CLIENTS__?.length) {
    (window as any).__APOLLO_CLIENTS__ = [{ client, clientId: "main" }];
  }

  return (
    <Provider theme={teamsTheme}>
      <ApolloProvider client={client}>
        <ApolloCacheContainer />
      </ApolloProvider>
    </Provider>
  );
};

export default App;
