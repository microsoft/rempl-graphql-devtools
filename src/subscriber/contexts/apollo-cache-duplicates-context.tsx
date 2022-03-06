import React from "react";
import { NormalizedCacheObject } from "@apollo/client/cache";
import { ClientCacheDuplicates } from "../../types";
import isEqual from "lodash.isequal";
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
  const [cacheDuplicates, setCacheDuplicates] =
    React.useState<ClientCacheDuplicates>({});
  const myTool = React.useRef(rempl.getSubscriber());

  React.useEffect(() => {
    myTool.current
      .ns("apollo-cache-duplicates")
      .subscribe(function (data: ClientCacheDuplicates) {
        if (data) {
          setCacheDuplicates(data);
        }
      });
  }, []);

  const getCacheDuplicates = React.useCallback(
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
