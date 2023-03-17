import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
  MenuButtonProps,
} from "@fluentui/react-components";
import * as React from "react";
import { useStyles } from "./operations-copy-button-styles";

export interface ICopyButtonProps {
  copyOperation: (type: "all" | "selected") => void;

  hideCopy: boolean;
}

export const CopyButton = (props: ICopyButtonProps) => {
  const classes = useStyles();
  const { copyOperation, hideCopy } = props;
  const copySelected = React.useCallback(() => {
    copyOperation("selected");
  }, [copyOperation]);
  const copyAll = React.useCallback(() => {
    copyOperation("all");
  }, [copyOperation]);
  return (
    <div className={classes.button}>
      <Menu positioning="below-end">
        <MenuTrigger disableButtonEnhancement>
          {(triggerProps: MenuButtonProps) => (
            <SplitButton
              disabled={hideCopy}
              onClick={copyAll}
              menuButton={triggerProps}
            >
              Copy All
            </SplitButton>
          )}
        </MenuTrigger>

        <MenuPopover>
          <MenuList>
            <MenuItem onClick={copySelected}>Copy Selected</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
