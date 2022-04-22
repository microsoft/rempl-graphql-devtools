import React, { useState } from "react";
import { dialogStyles } from "./dialog.styles";
import { Text, Headline } from "@fluentui/react-components";
import { CacheObjectWithSize } from "../../subscriber/apollo-cache/types";

interface DialogProps {
    value: CacheObjectWithSize | undefined;
    onClose: () => void
}

export const Dialog = React.memo(({value, onClose}: DialogProps) => {
  const classes = dialogStyles();

  return (
    <div 
        className={classes.root} 
        onClick={() => onClose()}>
        <div 
            className={classes.dialogContainer}
            onClick={(e) => {e.stopPropagation()}}>
            <Headline>{value?.key}</Headline>
            <Text 
                className={classes.description}
                weight="semibold"
            >
                {value?.valueSize} B
            </Text>
            <div className={classes.contentPre}>
              <pre className={classes.preStyles}>
                <code>
                  <p>{JSON.stringify(value?.value, null, 2)}</p>
                </code>
              </pre>
            </div>
        </div>
    </div>
  );
});
