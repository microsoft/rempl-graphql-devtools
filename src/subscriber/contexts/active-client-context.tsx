import React, { useEffect, useState, useCallback } from "react";
import rempl from "rempl";
import { Dropdown } from "../../components";

export const ActiveClientContext = React.createContext("");

export const ActiveClientContextWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [activeClientId, setActiveClientId] = useState<string>("");
  const [clientIds, setClientIds] = useState<string[]>([]);
  const myTool = React.useRef(rempl.getSubscriber());

  useEffect(() => {
    myTool.current.ns("apollo-client-ids").subscribe((data: string[]) => {
      if (data) {
        setClientIds(data);
      }
    });
  }, []);

  const onChange = useCallback((_: any, { value }: any) => {
    myTool.current.callRemote("setActiveClientId", {
      clientId: value,
    });
    setActiveClientId(value);

    window.REMPL_GRAPHQL_DEVTOOLS_RECENT_ACTIVITIES = [];
  }, []);

  if (!activeClientId && clientIds.length) {
    myTool.current.callRemote("setActiveClientId", {
      clientId: clientIds[0],
    });
    setActiveClientId(clientIds[0]);
  }

  return (
    <>
      <div>
        <Dropdown
          items={clientIds}
          onChange={onChange}
          value={activeClientId}
        />
      </div>
      {activeClientId ? (
        <ActiveClientContext.Provider value={activeClientId}>
          {children}
        </ActiveClientContext.Provider>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
