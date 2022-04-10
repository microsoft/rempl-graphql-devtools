import React, { useState, useEffect, useRef } from "react";
import rempl from "rempl";
import { Mutation } from "../../../types";
import { Mutations } from "./mutations";

const MutationsContainer = () => {
  const [apolloTrackerMutations, setApolloTrackerMutations] = useState<
    Mutation[]
  >([]);
  const myTool = useRef(rempl.getSubscriber());

  useEffect(() => {
    myTool.current
      .ns("apollo-tracker-mutations")
      .subscribe((data: Mutation[]) => {
        if (data) {
          setApolloTrackerMutations(data);
        }
      });
  }, []);

  return <Mutations mutations={apolloTrackerMutations} />;
};

export default MutationsContainer;
