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
        if (data) {
          setApolloTrackerQueries(data);
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return <WatchedQueries queries={apolloTrackerQueries} />;
});

export default WatchedQueriesContainer;
