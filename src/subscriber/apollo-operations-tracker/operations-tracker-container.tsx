import { remplSubscriber } from "../rempl";
import React, { useState, useEffect, useCallback } from "react";
import { IDataView } from "apollo-inspector";
import { mergeClasses } from "@fluentui/react-components";
import { OperationsListViewContainer } from "./operations-list-view-container/operations-list-view-container";
import { useStyles } from "./operations-tracker-container-styles";
import { OperationsTrackerHeader } from "./operations-tracker-header";

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
        setApolloOperationsData(null);
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
        <OperationsTrackerHeader
          isRecording={isRecording}
          openDescription={openDescription}
          setOpenDescription={setOpenDescription}
          toggleRecording={toggleRecording}
        />
        <OperationsListViewContainer data={apollOperationsData} />
      </div>
    </div>
  );
};
