import React from "react";
import { Text, Flex, InfoIcon, Popup } from "@fluentui/react-northstar";
import { useStyles } from "./menu-item-styles";
import { Link } from "react-router-dom";

interface MenuItemProps {
  url: string;
  title: string;
  description: string;
  isActive: boolean;
}

export const MenuItem = ({
  url,
  title,
  description,
  isActive,
}: MenuItemProps) => {
  const classes = useStyles();

  return (
    <Link
      to={url}
      className={classes.link}
      style={{ color: isActive ? "black" : "inherit" }}
    >
      <Flex vAlign="center">
        <Text content={title} weight={isActive ? "bold" : "regular"} />
        {isActive && (
          <Popup
            trigger={<InfoIcon className={classes.icon} outline size="small" />}
            content={description}
          />
        )}
      </Flex>
    </Link>
  );
};
