import React from "react";
import { CacheObjectWithSize } from "./types";

interface IApolloCacheItems {
  cacheObjectsWithSize: CacheObjectWithSize[];
}

const header = {
  key: "header",
  items: [
    {
      content: "Key",
      key: "name",
    },
    {
      content: "Value size",
      key: "value",
    },
    {
      key: "actions",
      "aria-label": "more actions",
    },
  ],
};

export const ApolloCacheItems = ({
  cacheObjectsWithSize,
}: IApolloCacheItems) => {
  const [detailsValue, setDetailsValue] = React.useState<
    CacheObjectWithSize | undefined
  >(undefined);
  let rowsPlain: any[] = [];
  cacheObjectsWithSize.forEach((item: CacheObjectWithSize, index: number) => {
    rowsPlain.push({
      key: index,
      items: [
        {
          key: `${index}-1`,
          content: item.key,
          truncateContent: true,
        },
        {
          key: `${index}-2`,
          content: `${item.valueSize} B`,
        },
        {
          key: `${index}-3`,
          content: (
            <div style={{display: "flex", alignItems: "center"}}>
              <button
                onClick={() => {
                  setDetailsValue(item);
                }}
              >Show details</button>
            </div>
          ),
          truncateContent: true,
        },
      ],
    });
  });

  return (
    <>
      <div
        style={{
          gridColumn: detailsValue ? "span 3" : "span 5",
          overflow: "auto",
        }}
      >
        {/* <Table
          variables={{
            cellContentOverflow: "none",
          }}
          header={header}
          rows={rowsPlain}
          aria-label="Apollo Cache Table"
        /> */}
      </div>
      {detailsValue ? (
        <div
          style={{
            gridColumn: "span 2",
            overflow: "auto",
          }}
        >
          <div style={{display: "flex", justifyContent:"flex-end"}}>
            <button
              onClick={() => setDetailsValue(undefined)}
            >Close</button>
          </div>
          <h3>{detailsValue.key}</h3>
          <p>{`${detailsValue.valueSize} B`}</p>
          <div style={{ display: "flex", alignItems:"flex-start", overflow: "auto" }}>
            <pre>
              <code>
                <p>{JSON.stringify(detailsValue.value, null, 2)}</p>
              </code>
            </pre>
          </div>
        </div>
      ) : null}
    </>
  );
};
