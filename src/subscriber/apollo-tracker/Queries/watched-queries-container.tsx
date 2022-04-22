import React, { useState, useEffect, useRef } from "react";
import rempl from "rempl";
import { WatchedQuery } from "../../../types";
import { WatchedQueries } from "./watched-queries";

const WatchedQueriesContainer = () => {
  const [apolloTrackerQueries, setApolloTrackerQueries] = useState<
    WatchedQuery[]
  >([]);
  const myTool = useRef(rempl.getSubscriber());

  useEffect(() => {
    myTool.current
      .ns("apollo-tracker-queries")
      .subscribe((data: WatchedQuery[]) => {
        if (data) {
          setApolloTrackerQueries(data);
        }
      });
  }, []);

  return <WatchedQueries queries={apolloTrackerQueries} />;
};

export default WatchedQueriesContainer;
