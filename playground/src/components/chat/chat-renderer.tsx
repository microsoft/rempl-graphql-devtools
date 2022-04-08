import React from "react";
import { Messages } from "./messages";
import {
  Header,
  Grid,
  Segment,
  Button,
  Input,
  Flex,
  FlexItem,
} from "@fluentui/react-northstar";
import { SearchIcon } from "@fluentui/react-icons-northstar";

interface IChatRenderer {
  ids: string[];
  removeMessage: (id: string) => void;
  addMessage: (message: string) => void;
}

export const ChatRenderer = ({
  ids,
  removeMessage,
  addMessage,
}: IChatRenderer) => {
  const [messageText, setMessageText] = React.useState("");
  const handleChange = React.useCallback((event) => {
    setMessageText(event.target.value);
  }, []);

  return (
    <Grid
      columns="repeat(5, 1fr)"
      styles={{
        height: "calc(100vh - 45px)",
        gridTemplateRows:
          "[row1-start] 85px [row1-end] 65px [third-line] auto [last-line]",
      }}
    >
      <Segment
        styles={{
          gridColumn: "span 5",
        }}
      >
        <Header as="h2" content="Chat example" />
      </Segment>
      <Segment
        color="brand"
        styles={{
          gridColumn: "span 5",
        }}
      >
        <Input
          fluid
          placeholder="Message"
          onChange={(e: React.SyntheticEvent) => {
            const input = e.target as HTMLInputElement;
            setMessageText(input.value);
          }}
        />
        <Button onClick={() => addMessage(messageText)} content="Add Message" />
      </Segment>
      <Messages ids={ids} removeMessage={removeMessage} />
    </Grid>
  );
};
