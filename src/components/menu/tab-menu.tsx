import React from "react";
import { tabMenuStyles } from "./tab-menu.styles";
import { mergeClasses } from "@fluentui/react-components";

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
            className={mergeClasses(
              classes.tabMenuItem, 
              currentType === 'all' && classes.tabMenuItemActive
            )}
            onClick={() => onSelectItem('all')}
        >All cache</li>
        <li 
          className={mergeClasses(
            classes.tabMenuItem, 
            currentType === 'recent' && classes.tabMenuItemActive
          )}
          onClick={() => onSelectItem('recent')}
        >Recent cache</li>
        <li 
          className={mergeClasses(
            classes.tabMenuItem, 
            currentType === 'duplicated' && classes.tabMenuItemActive
          )}
          onClick={() => onSelectItem('duplicated')}
        >Duplicated cache</li>
      </ul>
    </nav>
  );
});
