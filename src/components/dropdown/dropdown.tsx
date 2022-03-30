import React from "react";
import { useStyles } from "./dropdown-styles";
import { Menu, MenuButton, MenuList, MenuPopover, MenuTrigger, Text, MenuItem } from "@fluentui/react-components";

export const Dropdown = React.memo((props: any) => {
  const classes = useStyles();

  return (
    <div
      className={classes.container}
      id="apollo-client-dropdown"
    >
      <Text weight="semibold">Apollo client:</Text>
      {/* <FormDropdown
        className={classes.adDropdown}
        items={props.items}
        onChange={props.onChange}
        value={props.value}
        placeholder="Choose a apollo client"
      /> */}
      <Menu>
        <MenuTrigger>
          <MenuButton>{props.value}</MenuButton>
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            {props.items.map(elem => (
              <MenuItem>{elem}</MenuItem>
            ))}
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
});
