import React from 'react';
import { CacheObjectWithSize } from './types';
import { ApolloCacheItems } from './apollo-cache-items';
import {
  Header,
  Input,
  Grid,
  Segment,
  Flex,
  FlexItem,
} from '@fluentui/react-northstar';
import { SearchIcon } from '@fluentui/react-icons-northstar';

interface IApolloCacheRenderer {
  cacheObjectsWithSize: CacheObjectWithSize[];
  removeCacheItem: (key: string) => void;
  cacheSize: number;
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
  cacheSize,
  removeCacheItem,
}: IApolloCacheRenderer) => {
  const [searchKey, setSearchKey] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');

  return (
    <Grid
      columns="repeat(5, 1fr)"
      styles={{
        height: 'calc(100vh - 45px)',
        gridTemplateRows:
          '[row1-start] 85px [row1-end] 65px [third-line] auto [last-line]',
      }}
    >
      <Segment
        styles={{
          gridColumn: 'span 5',
        }}
      >
        <Header
          as="h2"
          content={`Apollo cache (overall size ${cacheSize} B)`}
        />
      </Segment>
      <Segment
        color="brand"
        styles={{
          gridColumn: 'span 5',
        }}
      >
        <Flex gap="gap.large">
          <FlexItem size="size.large">
            <Input
              icon={<SearchIcon />}
              placeholder="Search by key..."
              role="search"
              clearable
              fluid
              onChange={(e: React.SyntheticEvent) => {
                const input = e.target as HTMLInputElement;
                setSearchKey(input.value);
              }}
            />
          </FlexItem>
          <FlexItem size="size.large">
            <Input
              icon={<SearchIcon />}
              placeholder="Search by value..."
              role="search"
              clearable
              fluid
              onChange={(e: React.SyntheticEvent) => {
                const input = e.target as HTMLInputElement;
                setSearchValue(input.value);
              }}
            />
          </FlexItem>
        </Flex>
      </Segment>
      <ApolloCacheItems
        cacheObjectsWithSize={filterCacheObjects(
          cacheObjectsWithSize,
          searchKey,
          searchValue
        )}
        removeCacheItem={removeCacheItem}
      />
    </Grid>
  );
};
