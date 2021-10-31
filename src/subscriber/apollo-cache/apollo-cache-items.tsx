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
  removeCacheItem: (key: string) => void;
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

const buildCacheItems =
  (
    removeCacheItem: (key: string) => void,
    setDetailsValue: (value: CacheObjectWithSize) => void
  ) =>
  (item: CacheObjectWithSize, index: number) => ({
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
            <Button
              onClick={(e) => {
                removeCacheItem(item.key);
                e.stopPropagation();
              }}
              size="small"
              content="Remove item"
            />
          </Flex>
        ),
        truncateContent: true,
      },
    ],
  });

export const ApolloCacheItems = ({
  cacheObjectsWithSize,
  removeCacheItem,
}: IApolloCacheItems) => {
  const [detailsValue, setDetailsValue] = React.useState<
    CacheObjectWithSize | undefined
  >(undefined);

  if (!cacheObjectsWithSize.length) {
    return null;
  }

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
          rows={cacheObjectsWithSize.map(
            buildCacheItems(removeCacheItem, setDetailsValue)
          )}
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
