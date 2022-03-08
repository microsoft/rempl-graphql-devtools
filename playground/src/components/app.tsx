import { Provider, teamsTheme, Menu } from "@fluentui/react-northstar";
import { ApolloProvider } from "@apollo/client";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { buildClient } from "data/data-builder";
import Hello from "./hello";
import ApolloCacheContainer from "./apollo-cache/apollo-cache-container";

const items = [
  {
    key: "home",
    content: <Link to="/">Home</Link>,
  },
  {
    key: "apollo-cache",
    content: <Link to="apollo-cache">Apollo Cache</Link>,
  },
];

const App = () => {
  const client = buildClient();
  if ((window as any) && !(window as any).__APOLLO_CLIENTS__?.length) {
    (window as any).__APOLLO_CLIENTS__ = [{ client, clientId: "main" }];
  }

  return (
    <Provider theme={teamsTheme}>
      <ApolloProvider client={client}>
        <Router>
          <Menu defaultActiveIndex={0} items={items} primary />
          <Switch>
            <Route path="/apollo-cache">
              <ApolloCacheContainer />
            </Route>
            <Route path="/">
              <Hello />
            </Route>
          </Switch>
        </Router>
      </ApolloProvider>
    </Provider>
  );
};

export default App;
