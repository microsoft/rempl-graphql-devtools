import React, { useState } from "react";
import { useStyles } from "./list.styles";
import { Search } from "../search/search";
import { mergeClasses } from "@fluentui/react-components";

interface ListProps {
  isExpanded: boolean;
  items: any;
  selectedIndex: number;
}

function filterListItems(items: any[], searchValue: string) {
  if (!searchValue) return items;
  const filteredItems = [...items];

  return filteredItems.filter((value: any) => {
    return JSON.stringify(value.key).toLowerCase().includes(searchValue);
  });
}

export const List = React.memo(
  ({ isExpanded, items, selectedIndex }: ListProps) => {
    const [searchValue, setSearchValue] = useState("");
    const classes = useStyles();

    return (
      <div
        className={mergeClasses(classes.root, isExpanded && classes.hidden)}
      >
        <div className={classes.searchContainer}>
          <Search
            onSearchChange={(e: React.SyntheticEvent) => {
              const input = e.target as HTMLInputElement;
              setSearchValue(input.value);
            }}
          />
        </div>
        <ul className={classes.list}>
          {filterListItems(items, searchValue).map((item, index) => (
            <li
              className={mergeClasses(
                classes.listItem,
                selectedIndex === item.index && classes.listItemActive
              )}
              key={item.key}
              onClick={() => item.onClick(item.index)}
            >
              {item.content}
            </li>
          ))}
        </ul>
      </div>
    );
  }
);
