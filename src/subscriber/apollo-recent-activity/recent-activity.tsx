import React from "react";
import { ActivityDialog, List } from "../../components";
import { mergeClasses, Text } from "@fluentui/react-components";
import { useStyles } from "./recent-activity.styles";
import moment from "moment";

export const RecentActivity = ({ activity }: {activity: any}) => {
  const classes = useStyles();
  const [detailsValue, setDetailsValue] = React.useState<any>(undefined);

  const closeDetails = () => {
    setDetailsValue(undefined);
  };

  return (
    <div className={classes.activityContainer}>
      <List 
        items={
          activity.map((elem: any, index: number) => ({
            index: index + elem.timestamp,
            onClick: () => {setDetailsValue(elem)},
            content: (
              <div
                className={classes.activityItem} 
                key={index + elem.timestamp}>
                <Text className={classes.name} block>{elem.mutations[0]?.data?.name}</Text>
                <div className={mergeClasses(
                  classes.label,
                  elem.queries[0]?.change === 'added' && classes.added,
                  elem.queries[0]?.change === 'removed' && classes.removed
                )}>{elem.queries[0]?.change}</div>
                <div className={classes.time}>{moment(elem.timestamp).format('DD.MM.YYYY hh:mm:ss')}</div>
              </div>
            )
          }))
        }
        search={false}
        fill
      />
      {detailsValue ? <ActivityDialog value={detailsValue} onClose={closeDetails}/> : null}
    </div>
  )
};