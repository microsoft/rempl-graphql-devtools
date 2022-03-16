import React from "react";
import { CacheObjectWithSize } from "./types";
import {
  Button,
  Table,
  Segment,
  Flex,
  Header,
} from "@fluentui/react-northstar";

interface IApolloCacheItems {
  cacheObjectsWithSize: CacheObjectWithSize[];
}

const header = {
  key: "header",
  items: [
    {
      content: "Key",
      key: "name",
    },
    {
      content: "Value size",
      key: "value",
    },
    {
      key: "actions",
      "aria-label": "more actions",
    },
  ],
};

export const ApolloCacheItems = ({
  cacheObjectsWithSize,
}: IApolloCacheItems) => {
  const [detailsValue, setDetailsValue] = React.useState<
    CacheObjectWithSize | undefined
  >(undefined);
  let rowsPlain: any[] = [];
  cacheObjectsWithSize.forEach((item: CacheObjectWithSize, index: number) => {
    rowsPlain.push({
      key: index,
      items: [
        {
          key: `${index}-1`,
          content: item.key,
          truncateContent: true,
        },
        {
          key: `${index}-2`,
          content: `${item.valueSize} B`,
        },
        {
          key: `${index}-3`,
          content: (
            <Flex gap="gap.small" vAlign="center">
              <Button
                onClick={() => {
                  setDetailsValue(item);
                }}
                size="small"
                content="Show details"
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
          gridColumn: detailsValue ? "span 3" : "span 5",
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
      {detailsValue ? (
        <Segment
          styles={{
            gridColumn: "span 2",
            overflow: "auto",
          }}
        >
          <Flex hAlign="end">
            <Button
              size="small"
              content="Close"
              onClick={() => setDetailsValue(undefined)}
            />
          </Flex>
          <Header
            as="h3"
            content={detailsValue.key}
            description={`${detailsValue.valueSize} B`}
          />
          <Flex vAlign="start" styles={{ overflow: "auto" }}>
            <pre>
              <code>
                <p>{JSON.stringify(detailsValue.value, null, 2)}</p>
              </code>
            </pre>
          </Flex>
        </Segment>
      ) : null}
    </>
  );
};
