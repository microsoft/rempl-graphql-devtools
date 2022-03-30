import React, { useState } from "react";
import { tabMenuStyles } from "./tab-menu.styles";
import { mergeClasses, Text } from "@fluentui/react-components";

interface TabMenuProps {
  currentType: string;
  onSelectItem: (cacheType: string) => void
}

export const TabMenu = React.memo(({currentType, onSelectItem}: TabMenuProps) => {
  const classes = tabMenuStyles();

  return (
    <nav className={classes.root}>
      <ul className={classes.tabMenuList}>
        <li 
            className={currentType === 'all' 
                ? mergeClasses(classes.tabMenuItem, classes.tabMenuItemActive) 
                : classes.tabMenuItem}
            onClick={() => onSelectItem('all')}
        >All cache</li>
        <li 
             className={currentType === 'recent' 
             ? mergeClasses(classes.tabMenuItem, classes.tabMenuItemActive) 
             : classes.tabMenuItem}
         onClick={() => onSelectItem('recent')}
        >Recent cache</li>
        <li 
             className={currentType === 'duplicated' 
             ? mergeClasses(classes.tabMenuItem, classes.tabMenuItemActive) 
             : classes.tabMenuItem}
         onClick={() => onSelectItem('duplicated')}
        >Duplicated cache</li>
      </ul>
    </nav>
  );
});
