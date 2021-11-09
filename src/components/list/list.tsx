import React, { useState } from "react";
import { Box, List as FUIList, Input } from "@fluentui/react-northstar";
import { useStyles } from "./list-styles";

interface ListProps {
  isExpanded: boolean;
  items: any;
  selectedIndex: number;
}

function filterListItems(items: string[], searchValue: string) {
  if (!searchValue) return items;
  const filteredItems = [...items];

  return filteredItems.filter((value: string) =>
    JSON.stringify(value).includes(searchValue)
  );
}

export const List = React.memo(
  ({ isExpanded, items, selectedIndex }: ListProps) => {
    const [searchValue, setSearchValue] = useState("");
    const classes = useStyles();

    return (
      <Box
        className={classes.container}
        styles={{
          width: isExpanded ? 0 : "30%",
        }}
      >
        <Box className={classes.input}>
          <Input
            fluid
            placeholder="Search..."
            onChange={(e: React.SyntheticEvent) => {
              const input = e.target as HTMLInputElement;
              setSearchValue(input.value);
            }}
          />
        </Box>
        <FUIList
          className={classes.list}
          selectable
          truncateContent
          items={filterListItems(items, searchValue)}
          selectedIndex={selectedIndex}
        />
      </Box>
    );
  }
);
