import React, { useState, useEffect, useRef, useCallback } from "react";
import { RecentActivities } from "../../types";
import { Button } from "@fluentui/react-components";
import rempl from "rempl";

export const RecentActivityContainer = React.memo(() => {
  const [recentActivities, setRecentActivities] = useState<RecentActivities[]>(
    []
  );
  const [recordRecentActivity, setRecordRecentActivity] =
    useState<boolean>(false);
  const myTool = useRef(rempl.getSubscriber());

  useEffect(() => {
    const unsubscribe = myTool.current
      .ns("apollo-recent-activity")
      .subscribe((data: RecentActivities) => {
        if (data && recordRecentActivity) {
          setRecentActivities([...recentActivities, data]);
        }
      });

    return () => {
      myTool.current.callRemote("recordRecentActivity", {
        shouldRecord: false,
      });
      unsubscribe();
    };
  }, []);

  const recordRecentActivityRempl = React.useCallback(
    (shouldRecord: boolean) => {
      myTool.current.callRemote("recordRecentActivity", { shouldRecord });
    },
    []
  );

  const toggleRecordRecentChanges = useCallback(() => {
    recordRecentActivityRempl(!recordRecentActivity);
    setRecordRecentActivity(!recordRecentActivity);
  }, []);

  return (
    <div>
      <Button onClick={toggleRecordRecentChanges}>
        {recordRecentActivity ? "recording" : "not recording"}
      </Button>
    </div>
  );
});

export default RecentActivityContainer;
