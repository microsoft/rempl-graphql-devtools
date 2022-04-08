import React from "react";
import {
  Button,
  Table,
  Segment,
  Flex,
  Header,
} from "@fluentui/react-northstar";
import Message from "./message";

interface IMessages {
  ids: string[];
  removeMessage: (id: string) => void;
}

const header = {
  key: "header",
  items: [
    {
      content: "ID",
      key: "name",
    },
    {
      content: "Value",
      key: "value",
    },
    {
      key: "remove",
      "aria-label": "remove message",
    },
  ],
};

export const Messages = ({ ids, removeMessage }: IMessages) => {
  let rowsPlain: any[] = [];
  ids.forEach((id: string) => {
    rowsPlain.push({
      key: id,
      items: [
        {
          key: `${id}-1`,
          content: id,
          truncateContent: true,
        },
        {
          key: `${id}-2`,
          content: <Message id={id} />,
        },
        {
          key: `${id}-3`,
          content: (
            <Flex gap="gap.small" vAlign="center">
              <Button
                onClick={() => {
                  removeMessage(id);
                }}
                size="small"
                content="Remove message"
                primary
              />
            </Flex>
          ),
          truncateContent: true,
        },
      ],
    });
  });

  return (
    <>
      <Segment
        styles={{
          gridColumn: "span 5",
          overflow: "auto",
        }}
      >
        <Table
          variables={{
            cellContentOverflow: "none",
          }}
          header={header}
          rows={rowsPlain}
          aria-label="Apollo Cache Table"
        />
      </Segment>
    </>
  );
};
