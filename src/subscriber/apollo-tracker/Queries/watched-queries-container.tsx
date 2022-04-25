import React, { useState, useEffect, useRef, memo } from "react";
import rempl from "rempl";
import { WatchedQuery } from "../../../types";
import { WatchedQueries } from "./watched-queries";

const WatchedQueriesContainer = memo(() => {
  const [apolloTrackerQueries, setApolloTrackerQueries] = useState<
    WatchedQuery[]
  >([]);
  const myTool = useRef(rempl.getSubscriber());

  useEffect(() => {
    const unsubscribe = myTool.current
      .ns("apollo-tracker-queries")
      .subscribe((data: WatchedQuery[]) => {
        if (data && hasChanged(apolloTrackerQueries, data)) {
          console.log(data);
          setApolloTrackerQueries(data);
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return <WatchedQueries queries={apolloTrackerQueries} />;
});

function hasChanged(currentQueries: WatchedQuery[], queries: WatchedQuery[]) {
  if (currentQueries.length !== queries.length) {
    return false;
  }

  for (let i = 0; i <= queries.length; i++) {
    if (currentQueries[i] !== queries[i]) {
      return true;
    }
  }

  return false;
}

export default WatchedQueriesContainer;
