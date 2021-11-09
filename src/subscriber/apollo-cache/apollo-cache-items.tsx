import React from "react";
import { CacheObjectWithSize } from "./types";
import {
  Button,
  Table,
  Flex,
  Text,
  Tooltip,
  BanIcon,
  ExpandIcon,
  CalendarAgendaIcon,
  CloseIcon,
  Alert,
  CollapseIcon,
} from "@fluentui/react-northstar";
import { useStyles } from "./apollo-cache-items-styles";

interface IApolloCacheItems {
  cacheObjectsWithSize: CacheObjectWithSize[];
  removeCacheItem: (key: string) => void;
  containerSize: string;
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
      styles: { maxWidth: "9rem" },
    },
    {
      key: "actions",
      "aria-label": "more actions",
      styles: { maxWidth: "6rem" },
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
        styles: { maxWidth: "9rem" },
      },
      {
        key: `${index}-3`,
        styles: { maxWidth: "6rem" },
        content: (
          <Flex gap="gap.small" vAlign="center">
            <Tooltip
              trigger={
                <Button
                  icon={<CalendarAgendaIcon size="small" />}
                  styles={({ theme: { siteVariables } }) => ({
                    background: siteVariables.colorScheme.green.foreground,
                  })}
                  primary
                  iconOnly
                  onClick={() => {
                    setDetailsValue(item);
                  }}
                />
              }
              content="Show details"
            />
            <Tooltip
              trigger={
                <Button
                  icon={<BanIcon size="small" />}
                  styles={({ theme: { siteVariables } }) => ({
                    color: siteVariables.colorScheme.red.background3,
                  })}
                  tinted
                  iconOnly
                  onClick={(e) => {
                    removeCacheItem(item.key);
                    e.stopPropagation();
                  }}
                />
              }
              content="Remove item"
            />
          </Flex>
        ),
      },
    ],
  });

export const ApolloCacheItems = React.memo(
  ({
    cacheObjectsWithSize,
    removeCacheItem,
    containerSize,
  }: IApolloCacheItems) => {
    const [detailsValue, setDetailsValue] = React.useState<
      CacheObjectWithSize | undefined
    >(undefined);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const classes = useStyles();

    if (!cacheObjectsWithSize.length) {
      return null;
    }

    const closeDetails = () => {
      setIsExpanded(false);
      setDetailsValue(undefined);
    };

    return (
      <Flex column styles={{ height: containerSize }}>
        <div
          style={{
            overflow: "auto",
            height: isExpanded ? 0 : detailsValue ? "50%" : "100%",
          }}
        >
          <Table
            compact
            variables={{
              cellContentOverflow: "none",
            }}
            header={header}
            rows={cacheObjectsWithSize.map(
              buildCacheItems(removeCacheItem, setDetailsValue)
            )}
            aria-label="Apollo Cache Table"
          />
        </div>
        {detailsValue ? (
          <div
            className={classes.detailsContainer}
            style={{ height: isExpanded ? "100%" : "50%" }}
          >
            <Flex column>
              <Flex space="between" vAlign="center">
                <div>
                  <Alert
                    fitted
                    header={detailsValue.key}
                    styles={{ flex: 1, padding: "0 0.5rem" }}
                  />
                </div>
                <div>
                  <Tooltip
                    trigger={
                      <Button
                        styles={{ marginRight: "0.625rem" }}
                        icon={
                          isExpanded ? (
                            <CollapseIcon size="small" />
                          ) : (
                            <ExpandIcon size="small" />
                          )
                        }
                        tinted
                        iconOnly
                        onClick={() => setIsExpanded(!isExpanded)}
                      />
                    }
                    content={isExpanded ? "Minimize" : "Expand"}
                  />
                  <Tooltip
                    trigger={
                      <Button
                        icon={<CloseIcon size="small" />}
                        tinted
                        iconOnly
                        onClick={closeDetails}
                      />
                    }
                    content="Close"
                  />
                </div>
              </Flex>
              <Text content={`${detailsValue.valueSize} B`} color="brand" />
            </Flex>
            <Flex vAlign="start" className={classes.detailsValue}>
              <pre className={classes.preStyles}>
                <code>
                  <p>{JSON.stringify(detailsValue.value, null, 2)}</p>
                </code>
              </pre>
            </Flex>
          </div>
        ) : null}
      </Flex>
    );
  }
);
