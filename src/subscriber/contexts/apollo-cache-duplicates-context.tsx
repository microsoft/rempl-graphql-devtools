import React, { useEffect, useState, useRef, useCallback } from "react";
import { CacheDuplicates } from "../../types";
import rempl from "rempl";

export type ApolloCacheDuplicatesContextType = {
  getCacheDuplicates: (clientIdToModify: string) => void;
  cacheDuplicates: CacheDuplicates;
} | null;

export const ApolloCacheDuplicatesContext =
  React.createContext<ApolloCacheDuplicatesContextType>(null);

export const ApolloCacheDuplicatesContextWrapper = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const [cacheDuplicates, setCacheDuplicates] = useState<CacheDuplicates>([]);
  const myTool = useRef(rempl.getSubscriber());

  useEffect(() => {
    myTool.current
      .ns("apollo-cache-duplicates")
      .subscribe(function (data: CacheDuplicates) {
        if (data) {
          setCacheDuplicates(data);
        }
      });
  }, []);

  const getCacheDuplicates = useCallback(() => {
    myTool.current.callRemote("getCacheDuplicates", {});
  }, [cacheDuplicates]);

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
