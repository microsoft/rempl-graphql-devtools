import React, { useEffect, useState, useRef, useCallback } from "react";
import { ClientCacheDuplicates } from "../../types";
import rempl from "rempl";

export type ApolloCacheDuplicatesContextType = {
  getCacheDuplicates: (clientIdToModify: string) => void;
  cacheDuplicates: ClientCacheDuplicates;
} | null;

export const ApolloCacheDuplicatesContext =
  React.createContext<ApolloCacheDuplicatesContextType>(null);

export const ApolloCacheDuplicatesContextWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [cacheDuplicates, setCacheDuplicates] = useState<ClientCacheDuplicates>(
    {}
  );
  const myTool = useRef(rempl.getSubscriber());

  useEffect(() => {
    myTool.current
      .ns("apollo-cache-duplicates")
      .subscribe(function (data: ClientCacheDuplicates) {
        if (data) {
          setCacheDuplicates(data);
        }
      });
  }, []);

  const getCacheDuplicates = useCallback(
    (clientIdToCheck: string) => {
      myTool.current.callRemote("getCacheDuplicates", {
        clientId: clientIdToCheck,
      });
    },
    [cacheDuplicates]
  );

  return (
    <ApolloCacheDuplicatesContext.Provider
      value={{
        cacheDuplicates,
        getCacheDuplicates,
      }}
    >
      {children}
    </ApolloCacheDuplicatesContext.Provider>
  );
};
