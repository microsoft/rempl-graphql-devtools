import React, { Fragment, useCallback } from "react";
import { CacheObjectWithSize } from "./types";
import { ApolloCacheItems } from "./apollo-cache-items";
import {
  Input,
  Button,
  Flex,
  Alert,
  Tooltip,
  Dropdown,
} from "@fluentui/react-northstar";
import {
  BanIcon,
  CallRecordingIcon,
  SearchIcon,
} from "@fluentui/react-icons-northstar";
import debounce from "lodash.debounce";
import { useStyles } from "./apollo-cache-renderer-styles";
import { useAutoContainerHeight } from "../../helpers/container-height";

interface IApolloCacheRenderer {
  cacheObjectsWithSize: CacheObjectWithSize[];
  recentCacheWithSize: CacheObjectWithSize[];
  recordRecentCacheChanges: (shouldRemove: boolean) => void;
  clearRecentCacheChanges: () => void;
  getCacheDuplicates: () => void;
  removeCacheItem: (key: string) => void;
  cacheSize: number;
}

function filterCacheObjects(
  cacheObjectsWithSize: CacheObjectWithSize[],
  searchKey: string
) {
  if (!searchKey) return cacheObjectsWithSize;

  return cacheObjectsWithSize.filter(({ key }: CacheObjectWithSize) =>
    key.toLowerCase().includes(searchKey.toLowerCase())
  );
}
// magic number for fixed top bar and bottom status bar elements
const FIXED_BARS_HEIGHT = 68;

export const ApolloCacheRenderer = React.memo(
  ({
    cacheObjectsWithSize,
    recentCacheWithSize,
    getCacheDuplicates,
    cacheSize,
    removeCacheItem,
    recordRecentCacheChanges,
    clearRecentCacheChanges,
  }: IApolloCacheRenderer) => {
    const [searchKey, setSearchKey] = React.useState("");
    const [showRecentCache, setShowRecentCache] = React.useState(false);
    const [recordRecentCache, setRecordRecentCache] = React.useState(false);
    const classes = useStyles();
    const headerHeight = useAutoContainerHeight() + FIXED_BARS_HEIGHT;

    const toggleShowRecentCache = useCallback(() => {
      setShowRecentCache(!showRecentCache);
    }, [showRecentCache]);

    const toggleRecordRecentChanges = useCallback(() => {
      recordRecentCacheChanges(!recordRecentCache);
      setRecordRecentCache(!recordRecentCache);
    }, [recordRecentCache]);

    const debouncedSetSearchKey = useCallback(
      debounce((searchKey: string) => setSearchKey(searchKey), 250),
      [setSearchKey]
    );

    return (
      <Fragment>
        <Flex space="between" className={classes.topBar}>
          <Flex>
            <Button content="Find duplicities" onClick={getCacheDuplicates} />
            <Dropdown
              className={classes.switchDropdown}
              items={["All cache", "Recent cache"]}
              defaultValue={"All cache"}
              onChange={toggleShowRecentCache}
            />
            <Input
              icon={<SearchIcon />}
              placeholder="Search..."
              role="search"
              clearable
              fluid
              onChange={(e: React.SyntheticEvent) => {
                const input = e.target as HTMLInputElement;
                debouncedSetSearchKey(input.value);
              }}
            />
          </Flex>
          {showRecentCache && (
            <Flex gap="gap.smaller" className={classes.topBarActions}>
              <Tooltip
                trigger={
                  <Button
                    className={recordRecentCache ? classes.activeRecord : ""}
                    icon={<CallRecordingIcon size="medium" />}
                    iconOnly
                    tinted
                    onClick={toggleRecordRecentChanges}
                  />
                }
                content={recordRecentCache ? "Stop recording" : "Record"}
              />
              <Tooltip
                trigger={
                  <Button
                    disabled={recordRecentCache}
                    icon={<BanIcon size="medium" />}
                    tinted
                    iconOnly
                    onClick={clearRecentCacheChanges}
                  />
                }
                content="Clear"
              />
            </Flex>
          )}
        </Flex>
        <ApolloCacheItems
          cacheObjectsWithSize={
            showRecentCache
              ? recentCacheWithSize
              : filterCacheObjects(cacheObjectsWithSize, searchKey)
          }
          removeCacheItem={removeCacheItem}
          containerSize={`calc(100% - ${headerHeight}px)`}
        />
        <Alert
          success
          content={`Apollo cache (overall size ${cacheSize} B)`}
          className={classes.infoPanel}
        />
      </Fragment>
    );
  }
);
