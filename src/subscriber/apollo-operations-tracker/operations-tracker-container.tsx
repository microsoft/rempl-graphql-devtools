import { remplSubscriber } from "../rempl";
import React, { useState, useEffect, useCallback } from "react";
import { IDataView } from "apollo-inspector";
import { mergeClasses, Spinner, Title2 } from "@fluentui/react-components";
import { OperationsListViewContainer } from "./operations-list-view-container/operations-list-view-container";
import { useStyles } from "./operations-tracker-container-styles";
import { OperationsTrackerHeader } from "./operations-tracker-header";
import {
  IError,
  stylesClasses,
  ILoader,
} from "./operations-tracker-container.interface";

export const OperationsTrackerContainer = () => {
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const [apollOperationsData, setApolloOperationsData] =
    useState<IDataView | null>(null);
  const [loader, setLoader] = React.useState<ILoader>({
    message: "",
    loading: false,
  });
  const [error, setError] = React.useState<IError | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const classes = useStyles();

  useSubscribeToPublisher(setError, setApolloOperationsData, setLoader);

  const toggleRecording = useToggleRecording(
    setIsRecording,
    setApolloOperationsData,
    setLoader,
    setError,
  );

  useEffect(() => {
    return () => {
      remplSubscriber.callRemote("stopOperationsTracker", {});
    };
  }, [remplSubscriber]);

  const mainSlot = useMainSlot(error, classes, loader, apollOperationsData);

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
        {mainSlot}
      </div>
    </div>
  );
};

const useMainSlot = (
  error: IError | null,
  classes: Record<stylesClasses, string>,
  loader: ILoader,
  apollOperationsData: IDataView | null,
) =>
  React.useMemo(() => {
    if (error) {
      return (
        <div className={classes.centerDiv}>
          <Title2>{error.message}</Title2>
        </div>
      );
    }
    if (loader.loading) {
      return (
        <div className={classes.centerDiv}>
          <Spinner labelPosition="below" label={loader.message} />
        </div>
      );
    }

    return <OperationsListViewContainer data={apollOperationsData} />;
  }, [error, loader, apollOperationsData, classes]);

const useToggleRecording = (
  setIsRecording: React.Dispatch<React.SetStateAction<boolean>>,
  setApolloOperationsData: React.Dispatch<
    React.SetStateAction<IDataView | null>
  >,
  setLoader: React.Dispatch<React.SetStateAction<ILoader>>,
  setError: React.Dispatch<React.SetStateAction<IError | null>>,
) =>
  useCallback(() => {
    setIsRecording?.((isRecording) => {
      if (!isRecording) {
        remplSubscriber.callRemote("startOperationsTracker");
        setApolloOperationsData(null);
        setLoader({ message: "Recording operations", loading: true });
        setError(null);
      } else {
        remplSubscriber.callRemote("stopOperationsTracker", {});
        setLoader({ message: "Processing operations", loading: true });
      }
      return !isRecording;
    });
  }, [setIsRecording]);

const useSubscribeToPublisher = (
  setError: React.Dispatch<React.SetStateAction<IError | null>>,
  setApolloOperationsData: React.Dispatch<
    React.SetStateAction<IDataView | null>
  >,
  setLoader: React.Dispatch<React.SetStateAction<ILoader>>,
) => {
  useEffect(() => {
    remplSubscriber
      .ns("apollo-operations-tracker")
      .subscribe((data: IDataView) => {
        console.log(`jps data received`);
        if ((data as any).message) {
          const typedData = data as any;
          setError({ error: typedData.error, message: typedData.message });
          setLoader({ message: "", loading: false });
          return;
        }
        setApolloOperationsData(data);
        setLoader({ message: "", loading: false });
      });
  }, []);
};
