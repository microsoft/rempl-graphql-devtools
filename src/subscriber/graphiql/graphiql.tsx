import React, { useContext } from "react";
import rempl from "rempl";
import GraphiQL from "graphiql";
import { ActiveClientContext } from "../contexts/active-client-context";
import { FetcherParams } from "../../types";
import { qraphiqlStyles } from "./graphiql.styles";

(window as any).global = window;

export const createSimpleFetcher =
  (myTool: any, activeClientId: string) => (graphQLParams: FetcherParams) =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        console.error("graiphql request timeout");
        reject();
      }, 3000);

      myTool.callRemote(
        "graphiql",
        activeClientId,
        graphQLParams,
        (res: unknown) => {
          clearTimeout(timeout);
          resolve(res);
        }
      );
    });

const createFetcher = (myTool: any, activeClientId: string) => {
  const simpleFetcher = createSimpleFetcher(myTool, activeClientId);
  return (graphQLParams: FetcherParams) => {
    return simpleFetcher(graphQLParams);
  };
};

export const GraphiQLRenderer = React.memo(() => {
  const myTool = React.useRef(rempl.getSubscriber());
  const activeClientId = useContext(ActiveClientContext);
  const classes = qraphiqlStyles();

  return (
    <div className={classes.root}>
      <div className={classes.innerContainer}>
        <GraphiQL fetcher={createFetcher(myTool.current, activeClientId)} />
      </div>
    </div>
  );
});

export default GraphiQLRenderer;
