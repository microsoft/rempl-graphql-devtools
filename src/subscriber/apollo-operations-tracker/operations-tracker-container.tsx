import { remplSubscriber } from "../rempl";
import * as React from "react";
import { ApolloOperationsTrackerContext } from "../contexts";
import { Button } from "@fluentui/react-components";
export const OperationsTrackerContainer = () => {
  const { data, setApolloOperationsData } = React.useContext(
    ApolloOperationsTrackerContext,
  );
  const [isRecording, setIsRecording] = React.useState<boolean>(false);

  const toggleRecording = React.useCallback(() => {
    setIsRecording?.((isRecording) => {
      if (!isRecording) {
        remplSubscriber.callRemote("startOperationsTracker");
      } else {
        remplSubscriber.callRemote("stopOperationsTracker", {});
      }
      return !isRecording;
    });
  }, [setIsRecording]);

  React.useEffect(() => {
    return () => {
      remplSubscriber.callRemote("stopOperationsTracker", {});
    };
  }, [remplSubscriber]);

  return (
    <div>
      able to render{" "}
      <Button onClick={toggleRecording}>
        {isRecording ? "Stop Recording" : "Start Recording"}
      </Button>
    </div>
  );
};
