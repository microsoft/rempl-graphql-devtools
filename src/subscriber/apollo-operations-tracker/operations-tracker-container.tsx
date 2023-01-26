import { remplSubscriber } from "../rempl";
import React, { useState, useEffect, useCallback } from "react";
import { IDataView } from "apollo-inspector";
import { Button, mergeClasses } from "@fluentui/react-components";
import { Info20Regular } from "@fluentui/react-icons";
import { OperationViewContainer } from "./operations-tracker";
import { useStyles } from "./operations-tracker-styles";

export const OperationsTrackerContainer = () => {
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const classes = useStyles();
  const [apollOperationsData, setApolloOperationsData] =
    useState<IDataView | null>(null);

  useEffect(() => {
    remplSubscriber
      .ns("apollo-operations-tracker")
      .subscribe((data: IDataView) => {
        setApolloOperationsData(data);
      });
  }, []);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const toggleRecording = useCallback(() => {
    setIsRecording?.((isRecording) => {
      if (!isRecording) {
        remplSubscriber.callRemote("startOperationsTracker");
      } else {
        remplSubscriber.callRemote("stopOperationsTracker", {});
      }
      return !isRecording;
    });
  }, [setIsRecording]);

  useEffect(() => {
    return () => {
      remplSubscriber.callRemote("stopOperationsTracker", {});
    };
  }, [remplSubscriber]);

  return (
    <div className={classes.root}>
      <div
        className={mergeClasses(
          classes.innerContainer,
          openDescription && classes.innerContainerDescription,
        )}
      >
        <div className={classes.header}>
          <div>
            <Button
              title="Information"
              tabIndex={0}
              className={classes.infoButton}
              onClick={() => setOpenDescription(!openDescription)}
            >
              <Info20Regular />
            </Button>
            <Button onClick={toggleRecording}>
              {isRecording ? "Stop recording" : "Record recent activity"}
            </Button>
          </div>
        </div>
        <div
          className={mergeClasses(
            classes.description,
            openDescription && classes.openDescription,
          )}
        >
          It monitors changes in cache, fired mutations and
          activated/deactivated queries.
        </div>
        <OperationViewContainer
          operations={apollOperationsData?.verboseOperations || null}
        />
      </div>
    </div>
  );
};
