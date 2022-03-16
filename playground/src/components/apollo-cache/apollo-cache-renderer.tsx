import React from "react";
import { CacheObjectWithSize } from "./types";
import { ApolloCacheItems } from "./apollo-cache-items";
import {
  Header,
  Grid,
  Segment,
  Flex,
  FlexItem,
} from "@fluentui/react-northstar";
import { SearchIcon } from "@fluentui/react-icons-northstar";

interface IApolloCacheRenderer {
  cacheObjectsWithSize: CacheObjectWithSize[];
}

function filterCacheObjects(
  cacheObjectsWithSize: CacheObjectWithSize[],
  searchKey: string,
  searchValue: string
) {
  if (!searchValue && !searchKey) return cacheObjectsWithSize;
  let filteredCacheObject = [...cacheObjectsWithSize];

  if (searchKey) {
    filteredCacheObject = cacheObjectsWithSize.filter(
      ({ key }: CacheObjectWithSize) =>
        key.toLowerCase().includes(searchKey.toLowerCase())
    );
  }

  if (searchValue) {
    filteredCacheObject = cacheObjectsWithSize.filter(
      ({ value }: CacheObjectWithSize) =>
        JSON.stringify(value).includes(searchValue)
    );
  }

  return filteredCacheObject;
}

export const ApolloCacheRenderer = ({
  cacheObjectsWithSize,
}: IApolloCacheRenderer) => {
  const [searchKey, setSearchKey] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");

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
        <Header as="h2" content={`Example cache content`} />
      </Segment>
      <Segment
        color="brand"
        styles={{
          gridColumn: "span 5",
        }}
      ></Segment>
      <ApolloCacheItems
        cacheObjectsWithSize={filterCacheObjects(
          cacheObjectsWithSize,
          searchKey,
          searchValue
        )}
      />
    </Grid>
  );
};
