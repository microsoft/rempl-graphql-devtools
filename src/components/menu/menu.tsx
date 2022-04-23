import React, { useState } from "react";
import { menuStyles } from "./menu.styles";
import { NavLink } from "react-router-dom";
import {
  Info24Regular,
  Flowchart24Regular,
  Database24Regular,
  DataFunnel24Regular,
  DataWhisker24Regular,
} from "@fluentui/react-icons";
import { mergeClasses, Text, Badge } from "@fluentui/react-components";

interface MenuProps {
  cacheCount: number;
  mutationsCount: number;
  queriesCount: number;
}

const menuElements = (props: any) => [
  {
    url: "/",
    name: `Cache`,
    icon: <Database24Regular />,
    badge: props.cacheCount,
  },
  {
    url: "apollo-queries",
    name: `Watched Queries`,
    icon: <DataFunnel24Regular />,
    badge: props.queriesCount,
  },
  {
    url: "apollo-mutations",
    name: `Mutations`,
    icon: <DataWhisker24Regular />,
    badge: props.mutationsCount,
  },
  {
    url: "apollo-additional-informations",
    name: "Additional Information",
    icon: <Info24Regular />,
  },
  {
    url: "graphiql",
    name: "GraphiQL",
    icon: <Flowchart24Regular />,
  },
];

export const Menu = React.memo((props: MenuProps) => {
  const classes = menuStyles();
  const [activeItem, setActiveItem] = useState(0);

  return (
    <nav className={classes.root} id="menu-container">
      <ul className={classes.menuList}>
        {menuElements(props).map((item, index) => (
          <li>
            <NavLink
              to={item.url}
              className={mergeClasses(
                classes.menuItem,
                activeItem === index && classes.menuItemActive
              )}
              onClick={() => setActiveItem(index)}
            >
              <div className={classes.menuItemIcon}>{item.icon}</div>
              {true && <Text className={classes.menuText}>{item.name}</Text>}
              {item.badge && (
                <Badge appearance="tint" className={classes.badge}>
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
});
