import React from "react";
import { Button } from "@fluentui/react-components";
import { Info20Regular } from "@fluentui/react-icons";
import { useStyles } from "./operations-tracker-header-styles";
import { Search } from "../../../components";
import debounce from "lodash.debounce";
import { CopyButton } from "./operations-copy-button";

export interface IOperationsTrackerHeaderProps {
  setOpenDescription: React.Dispatch<React.SetStateAction<boolean>>;
  openDescription: boolean;
  toggleRecording: () => void;
  isRecording: boolean;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  copyOperation: (type: "all" | "selected") => void;
  clearApolloOperations: () => void;
  showClear: boolean;
}

export const OperationsTrackerHeader = (
  props: IOperationsTrackerHeaderProps,
) => {
  const classes = useStyles();
  const {
    isRecording,
    openDescription,
    setOpenDescription,
    toggleRecording,
    setSearchText,
    copyOperation,
    clearApolloOperations,
    showClear,
  } = props;

  const debouncedFilter = React.useCallback(
    debounce((e: React.SyntheticEvent) => {
      const input = e.target as HTMLInputElement;
      setSearchText(input.value);
    }, 200),
    [setSearchText],
  );

  return (
    <>
      <div className={classes.header}>
        <div className={classes.buttonContainer}>
          <Button
            title="Information"
            tabIndex={0}
            className={classes.infoButton}
            onClick={() => setOpenDescription(!openDescription)}
          >
            <Info20Regular />
          </Button>
          <Button onClick={toggleRecording}>
            {isRecording ? "Stop" : "Record"}
          </Button>
          <CopyButton
            hideCopy={isRecording || !showClear}
            copyOperation={copyOperation}
          />
          <Button
            style={{ marginLeft: "0.5rem" }}
            onClick={clearApolloOperations}
            disabled={!showClear}
          >
            Clear All
          </Button>
        </div>
        <div>
          <Search onSearchChange={debouncedFilter} />
        </div>
      </div>
      {openDescription && (
        <div className={classes.description}>
          It monitors changes in cache, fired mutations and
          activated/deactivated queries.
        </div>
      )}
    </>
  );
};
