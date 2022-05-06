import React, { createRef, useEffect } from "react";
import { dialogStyles } from "./activity-dialog.styles";
import { Text, Headline, Button } from "@fluentui/react-components";
import {Dismiss20Regular} from "@fluentui/react-icons";


interface ActivityDialogProps {
    value: any;
    onClose: () => void
}

export const ActivityDialog = React.memo(({value, onClose}: ActivityDialogProps) => {
  const classes = dialogStyles();
  const closeIcon = createRef<HTMLButtonElement>();

  useEffect(() => {
    closeIcon?.current?.focus();
    console.log(value);
  });

  return (
    <div 
        className={classes.root} 
        onClick={() => onClose()}>
        <div 
            className={classes.dialogContainer}
            onClick={(e) => {e.stopPropagation()}}>
              <div className={classes.header}>
                <Headline>Details</Headline>
                <Button 
                  appearance="transparent"
                  ref={closeIcon}
                  tabIndex={0}
                  onClick={() => onClose()}
                  className={classes.closeButton}
                  icon={<Dismiss20Regular />} />
              </div>
           

            <div className={classes.details}>
            <div>
              <Text weight="semibold">Mutation String</Text>
              <div className={classes.codeBox} style={{ fontSize: "12px" }}>
                <pre>
                  <code>
                    <p>{value?.mutations[0]?.data?.mutationString}</p>
                  </code>
                </pre>
              </div>
            </div>
            <div>
              <Text weight="semibold">Mutation variables</Text>
              <div className={classes.codeBox}>
                <pre>
                  <code>
                    <p>{JSON.stringify(value?.mutations[0]?.data?.variables)}</p>
                  </code>
                </pre>
              </div>
            </div>
            <div>
              <Text weight="semibold">Query String</Text>
              <div className={classes.codeBox} style={{ fontSize: "12px" }}>
                <pre>
                  <code>
                    <p>{value?.queries[0]?.data?.queryString}</p>
                  </code>
                </pre>
              </div>
            </div>
            <div>
              <Text weight="semibold">Query variables</Text>
              <div className={classes.codeBox}>
                <pre>
                  <code>
                    <p>{JSON.stringify(value?.queries[0]?.data?.variables)}</p>
                  </code>
                </pre>
              </div>
            </div>
            {value?.mutations[0]?.data?.errorMessage && (
              <div>
                <Text weight="semibold">Error</Text>
                <div className={classes.codeBox}>
                  <pre>
                    <code>
                      <p>{value?.mutations[0]?.data?.errorMessage}</p>
                    </code>
                  </pre>
                </div>
              </div>
            )}
            <div>
              <Text weight="semibold">Cache Data</Text>
              <div className={classes.codeBox}>
                <pre>
                  <code>
                    <p>{JSON.stringify(value?.queries[0]?.data?.cacheData, null, 2)}</p>
                  </code>
                </pre>
              </div>
            </div>
          </div>


        </div>
    </div>
  );
});
