import React, { useState, useEffect, useRef } from "react";
import { RecentActivities } from "../../types";
import { Button } from "@fluentui/react-components";
import rempl from "rempl";
import { useStyles } from "./recent-activity.styles";
import { RecentActivity } from "./recent-activity";

export const RecentActivityContainer = React.memo(() => {
  const [recentActivities, setRecentActivities] = useState<RecentActivities[]>(
    []
  );
  const [recordRecentActivity, setRecordRecentActivity] =
    useState<boolean>(false);
  const myTool = useRef(rempl.getSubscriber());
  const classes = useStyles();
  console.log(recentActivities);

  useEffect(() => {
    const unsubscribe = myTool.current
      .ns("apollo-recent-activity")
      .subscribe((data: RecentActivities) => {
        if (data) {
          const storedRecentActivities =
            window.REMPL_GRAPHQL_DEVTOOLS_RECENT_ACTIVITIES || [];
          const newRecentActivities = [data, ...storedRecentActivities];
          window.REMPL_GRAPHQL_DEVTOOLS_RECENT_ACTIVITIES = newRecentActivities;
          setRecentActivities(newRecentActivities);
        }
      });

    return () => {
      myTool.current.callRemote("recordRecentActivity", {
        shouldRecord: true,
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

  const toggleRecordRecentChanges = () => {
    recordRecentActivityRempl(!recordRecentActivity);
    setRecordRecentActivity(!recordRecentActivity);
    console.log("recentActivities", recentActivities);
  };

  return (
    <div className={classes.root}>
      <div className={classes.innerContainer}>
        <div className={classes.header}>
          <Button onClick={toggleRecordRecentChanges}>
            {recordRecentActivity ? "Stop recording" : "Recording recent activity"}
          </Button>
        </div>
        <RecentActivity activity={recentActivities} />
      </div>
    </div>
  );
});

export default RecentActivityContainer;
