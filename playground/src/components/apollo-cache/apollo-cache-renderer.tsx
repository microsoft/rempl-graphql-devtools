import React from "react";
import { CacheObjectWithSize } from "./types";
import { ApolloCacheItems } from "./apollo-cache-items";

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
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        height: "calc(100vh - 45px)",
        gridTemplateRows:
          "[row1-start] 85px [row1-end] 65px [third-line] auto [last-line]",
      }}
    >
      <div
        style={{
          gridColumn: "span 5",
        }}
      >
        <h2>Example cache content</h2>
      </div>
      <div
        style={{
          color: "blue",
          gridColumn: "span 5",
        }}
      ></div>
      <ApolloCacheItems
        cacheObjectsWithSize={filterCacheObjects(
          cacheObjectsWithSize,
          searchKey,
          searchValue
        )}
      />
    </div>
  );
};
