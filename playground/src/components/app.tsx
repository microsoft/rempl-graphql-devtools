import { Provider, teamsTheme, Menu } from "@fluentui/react-northstar";
import { ApolloProvider } from "@apollo/client";
import { buildClient } from "data/data-builder";
import ChatContainer from "./chat/chat-container";

const App = () => {
  const client = buildClient();
  if ((window as any) && !(window as any).__APOLLO_CLIENTS__?.length) {
    (window as any).__APOLLO_CLIENTS__ = [{ client, clientId: "main" }];
  }

  return (
    <Provider theme={teamsTheme}>
      <ApolloProvider client={client}>
        <ChatContainer />
      </ApolloProvider>
    </Provider>
  );
};

export default App;
