import React, { useState, useEffect, useCallback } from "react";
import { RecentActivities } from "../../types";
import { Button } from "@fluentui/react-components";
import { remplSubscriber } from "../rempl";

export const RecentActivityContainer = React.memo(() => {
  const [recentActivities, setRecentActivities] = useState<RecentActivities[]>(
    []
  );
  const [recordRecentActivity, setRecordRecentActivity] =
    useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = remplSubscriber
      .ns("apollo-recent-activity")
      .subscribe((data) => {
        if (data && recordRecentActivity) {
          setRecentActivities([...recentActivities, data]);
        }
      });

    return () => {
      remplSubscriber.callRemote("recordRecentActivity", {
        shouldRecord: false,
      });
      unsubscribe();
    };
  }, []);

  const recordRecentActivityRempl = React.useCallback(
    (shouldRecord: boolean) => {
      remplSubscriber.callRemote("recordRecentActivity", { shouldRecord });
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
