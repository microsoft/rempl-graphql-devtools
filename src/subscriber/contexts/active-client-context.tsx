import React, { useEffect, useState, useContext } from "react";
import { Loader } from "@fluentui/react-northstar";
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

  const onChange = (_: any, { value }: any) => {
    setActiveClientId(value);
  };

  if (!activeClientId && clientIds.length) {
    setActiveClientId(clientIds[0]);
  }

  return (
    <>
      <Dropdown items={clientIds} onChange={onChange} value={activeClientId} />
      {activeClientId ? (
        <ActiveClientContext.Provider value={activeClientId}>
          {children}
        </ActiveClientContext.Provider>
      ) : (
        <Loader />
      )}
    </>
  );
};
