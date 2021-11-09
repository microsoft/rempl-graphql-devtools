import React, { useState } from "react";
import { Box, List } from "@fluentui/react-northstar";
import { useStyles } from "./menu-styles";
import { MenuItem } from "./menu-item";
interface MenuProps {
  cacheCount: number;
  mutationsCount: number;
  queriesCount: number;
}

const items = (countData: MenuProps, activeIndex: number) => [
  {
    key: "apollo-cache",
    content: (
      <MenuItem
        url="/"
        title={`Cache (${countData.cacheCount})`}
        description='Contains a list of cache objects, which can be removed (be careful what you remove). You can also record recent changes by switching from "All cache" to "Recent cache"'
        isActive={activeIndex === 0}
      />
    ),
  },
  {
    key: "apollo-queries",
    content: (
      <MenuItem
        url="apollo-queries"
        title={`Watched Queries (${countData.queriesCount})`}
        description='Shows all currently active quries (watched Queries). "Go" in the name of some queries means Global Operation'
        isActive={activeIndex === 1}
      />
    ),
  },
  {
    key: "apollo-mutations",
    content: (
      <MenuItem
        url="apollo-mutations"
        title={`Mutations (${countData.mutationsCount})`}
        description='Shows fired mutations. "Go" in the name of some queries means Global Operation'
        isActive={activeIndex === 2}
      />
    ),
  },
  {
    key: "apollo-additional-informations",
    content: (
      <MenuItem
        url="apollo-additional-informations"
        title="Additional Information"
        description="Contains list of all global operations (Quries, Mutations and Subscribtion)"
        isActive={activeIndex === 3}
      />
    ),
  },
  {
    key: "graphiql",
    content: (
      <MenuItem
        url="graphiql"
        title="GraphiQL"
        description="Contains GraphiQL library. You can call quries and receive a response. For now it's not possible to call subscriptions"
        isActive={activeIndex === 4}
      />
    ),
  },
];

export const Menu = React.memo((props: MenuProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const classes = useStyles();

  return (
    <Box
      className={classes.container}
      styles={({ theme: { siteVariables } }) => ({
        backgroundColor: siteVariables.colorScheme.default.background5,
      })}
      id="menu-container"
    >
      <List
        className={classes.listMenu}
        selectable
        defaultSelectedIndex={0}
        items={items(props, activeIndex).map((item, index) => ({
          ...item,
          index,
          onClick: () => setActiveIndex(index),
        }))}
        horizontal
      />
    </Box>
  );
});
