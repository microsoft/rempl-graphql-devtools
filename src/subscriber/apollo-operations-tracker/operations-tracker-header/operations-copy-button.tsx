import {
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  SplitButton,
  MenuButtonProps,
  Button,
} from "@fluentui/react-components";
import { remplSubscriber } from "../../rempl";
import * as React from "react";
import { IOperationsReducerState } from "../operations-tracker-container-helper";
import { useStyles } from "./operations-copy-button-styles";
import { IDataView } from "apollo-inspector";

export interface ICopyButtonProps {
  hideCopy: boolean;
  operationsState: IOperationsReducerState;
  apolloOperationsData: IDataView | null;
}

export const CopyButton = (props: ICopyButtonProps) => {
  const classes = useStyles();
  const { operationsState, hideCopy, apolloOperationsData } = props;
  console.log({ operationsState, apolloOperationsData });

  const copyAll = React.useCallback(() => {
    console.log(`jps copyAll`);
    const ids: number[] = [];
    apolloOperationsData?.verboseOperations?.forEach((op) => {
      ids.push(op.id);
    });
    console.log({ ids });
    remplSubscriber.callRemote("copyOperationsData", ids);
  }, [apolloOperationsData]);

  const copyFiltered = React.useCallback(() => {
    console.log(`jps copyFiltered`);

    const ids: number[] = [];
    operationsState.filteredOperations?.forEach((op) => {
      ids.push(op.id);
    });
    console.log({ ids });

    remplSubscriber.callRemote("copyOperationsData", ids);
  }, [operationsState]);

  const copyChecked = React.useCallback(() => {
    console.log(`jps copyChecked`);

    const ids: number[] = [];
    operationsState.checkedOperations?.forEach((op) => {
      ids.push(op.id);
    });
    console.log({ ids });

    remplSubscriber.callRemote("copyOperationsData", ids);
  }, [operationsState]);

  const copySelected = React.useCallback(() => {
    console.log(`jps copySelected`);

    if (operationsState.selectedOperation?.id) {
      const ids: number[] = [operationsState.selectedOperation.id];
      console.log({ ids });

      remplSubscriber.callRemote("copyOperationsData", ids);
    }
  }, [operationsState]);

  const copyCache = React.useCallback(() => {
    console.log(`jps copyCache`);
    remplSubscriber.callRemote("copyOperationsData", [-1]);
  }, [operationsState]);

  if (hideCopy) {
    return (
      <div className={classes.button}>
        <Button onClick={copyCache}>Copy Whole Apollo Cache</Button>
      </div>
    );
  }

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
            <MenuItem onClick={copyAll}>Copy All Operations</MenuItem>
            {(operationsState.filteredOperations?.length || 0) > 0 ? (
              <MenuItem onClick={copyFiltered}>
                Copy Filtered Operations
              </MenuItem>
            ) : null}
            {(operationsState.checkedOperations?.length || 0) > 0 ? (
              <MenuItem onClick={copyChecked}>Copy Checked Operations</MenuItem>
            ) : null}
            {operationsState.selectedOperation ? (
              <MenuItem onClick={copySelected}>
                Copy currently Opened Operation
              </MenuItem>
            ) : null}
            <MenuItem onClick={copyCache}>Copy Whole Apollo Cache</MenuItem>
          </MenuList>
        </MenuPopover>
      </Menu>
    </div>
  );
};
