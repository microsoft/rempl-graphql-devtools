import React, { useState, useEffect } from "react";
import { RecentActivities } from "../../types";
import { Button, mergeClasses } from "@fluentui/react-components";
import { remplSubscriber } from "../rempl";
import { useStyles } from "./recent-activity.styles";
import { RecentActivity } from "./recent-activity";
import { Search } from "../../components";
import { Info20Regular} from "@fluentui/react-icons";

export const RecentActivityContainer = React.memo(() => {
  const [recentActivities, setRecentActivities] = useState<RecentActivities[]>(
    []
  );
  const [recordRecentActivity, setRecordRecentActivity] =
    useState<boolean>(false);

  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const classes = useStyles();

  useEffect(() => {
    const unsubscribe = remplSubscriber
      .ns("apollo-recent-activity")
      .subscribe((data) => {
        if (data) {
          const storedRecentActivities =
            window.REMPL_GRAPHQL_DEVTOOLS_RECENT_ACTIVITIES || [];
          const newRecentActivities = [data, ...storedRecentActivities];
          window.REMPL_GRAPHQL_DEVTOOLS_RECENT_ACTIVITIES = newRecentActivities;
          setRecentActivities(newRecentActivities);
        }
      });

    return () => {
      remplSubscriber.callRemote("recordRecentActivity", {
        shouldRecord: true,
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

  const toggleRecordRecentChanges = () => {
    recordRecentActivityRempl(!recordRecentActivity);
    setRecordRecentActivity(!recordRecentActivity);
    console.log("recentActivities", recentActivities);
  };

  return (
    <div className={classes.root}>
      <div className={mergeClasses(classes.innerContainer, openDescription && classes.innerContainerDescription)}>
        <div className={classes.header}>
          <div>
            <Button 
              title="Information"
              tabIndex={0}
              className={classes.infoButton}
              onClick={() => setOpenDescription(!openDescription)}>
              <Info20Regular />
            </Button>
            <Button onClick={toggleRecordRecentChanges}>
              {recordRecentActivity ? "Stop recording" : "Recording recent activity"}
            </Button>
          </div>
          <div className={classes.searchContainer}>
            <Search onSearchChange={(e: React.SyntheticEvent) => {
              const input = e.target as HTMLInputElement;
              console.log(input.value);
            }} />
          </div>
        </div>
        <div className={mergeClasses(classes.description, openDescription && classes.openDescription)}>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores minima eveniet laborum fuga atque commodi magni accusantium reprehenderit perspiciatis natus, quia rem officiis molestiae culpa, corrupti harum maxime tempora itaque libero corporis, facilis quae illum? Molestias repellat corporis quibusdam omnis atque et porro est, tempora nihil, a tenetur beatae saepe expedita? Dicta odio consequatur natus corporis beatae reprehenderit consectetur rerum nostrum fugit commodi excepturi quis, nihil, error autem cupiditate ad impedit saepe delectus quo itaque? Tempora autem quis quaerat eos itaque alias excepturi eveniet iure laborum facere quae, perspiciatis possimus iste. Doloremque sint corporis ad explicabo incidunt est, molestiae expedita?
        </div>
        <RecentActivity activity={recentActivities} />
      </div>
    </div>
  );
});

export default RecentActivityContainer;
