import React from "react";
import { Flex, FormDropdown, Text } from "@fluentui/react-northstar";
import { useStyles } from "./dropdown-styles";

export const Dropdown = React.memo((props: any) => {
  const classes = useStyles();

  return (
    <Flex
      className={classes.container}
      gap="gap.small"
      vAlign="center"
      hAlign="end"
      id="apollo-client-dropdown"
    >
      <Text content="Apollo client:" />
      <FormDropdown
        className={classes.adDropdown}
        items={props.items}
        onChange={props.onChange}
        value={props.value}
        placeholder="Choose a apollo client"
      />
    </Flex>
  );
});
