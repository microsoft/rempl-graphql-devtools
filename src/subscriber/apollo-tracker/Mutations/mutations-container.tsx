import React, { useState, useEffect, useRef, memo } from "react";
import rempl from "rempl";
import { Mutation } from "../../../types";
import { Mutations } from "./mutations";

const MutationsContainer = memo(() => {
  const [apolloTrackerMutations, setApolloTrackerMutations] = useState<
    Mutation[]
  >([]);
  const myTool = useRef(rempl.getSubscriber());

  useEffect(() => {
    const unsubscribe = myTool.current
      .ns("apollo-tracker-mutations")
      .subscribe((data: Mutation[]) => {
        if (data) {
          setApolloTrackerMutations(data);
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return <Mutations mutations={apolloTrackerMutations} />;
});

export default MutationsContainer;
