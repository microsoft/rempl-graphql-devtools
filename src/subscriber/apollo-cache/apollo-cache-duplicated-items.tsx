import React from "react";
import { useStyles } from "./apollo-cache-duplicated-items.styles";
import { Accordion, AccordionItem, AccordionHeader, AccordionPanel, Text } from "@fluentui/react-components";

interface IApolloCacheItems {
  duplicatedCacheObjects: any;
}

export const ApolloCacheDuplicatedItems = React.memo(
  ({
    duplicatedCacheObjects,
  }: IApolloCacheItems) => {
    const classes = useStyles();

    if (!duplicatedCacheObjects || !duplicatedCacheObjects.length) {
      return null;
    }

    return (
      <div className={classes.root}>
        <Accordion 
          multiple>
          {duplicatedCacheObjects.map((item, index) => 
            <AccordionItem value={index} key={`duplicates ${index}`}>
              <AccordionHeader className={classes.accordionHeader}>
                <Text weight="semibold">
                  Message: {item[0].message} <Text className={classes.counter}>({item.length})</Text>
                </Text>
              </AccordionHeader>
              <AccordionPanel>
                {item.map((obj, index) => 
                  <div className={classes.cacheItem} key={`message ${index}`}>
                    <div>{`Message:${obj.id}`}</div>
                    <div>{obj.message}</div>
                  </div>
                )}
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    );
  }
);
