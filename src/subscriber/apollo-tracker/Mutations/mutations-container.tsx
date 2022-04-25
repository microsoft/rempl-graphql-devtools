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
        if (data && hasChanged(apolloTrackerMutations, data)) {
          setApolloTrackerMutations(data);
        }
      });

    return () => {
      unsubscribe();
    };
  }, []);

  return <Mutations mutations={apolloTrackerMutations} />;
});

function hasChanged(currentMutations: Mutation[], mutations: Mutation[]) {
  if (currentMutations.length !== mutations.length) {
    return false;
  }

  for (let i = 0; i <= mutations.length; i++) {
    if (currentMutations[i] !== mutations[i]) {
      return true;
    }
  }

  return false;
}

export default MutationsContainer;
