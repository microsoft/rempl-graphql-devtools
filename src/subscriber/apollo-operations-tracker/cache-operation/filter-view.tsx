import { Checkbox } from "@fluentui/react-components";
import { OperationType, ResultsFrom } from "apollo-inspector";
import * as React from "react";
import { useStyles } from "./filter-view.styles";

interface IFilterView {
  setFilters: (filterSet: IFilterSet | null) => void;
}

export enum OperationStatus {
  InFlight = "InFlight",
  Succeded = "Succeded",
  Failed = "Failed",
  PartialSuccess = "PartialSuccess",
  Unknown = "Unknown",
}

export interface IFilterSet {
  results: string[];
  types: string[];
  statuses: string[];
}

export const querySubTypes = [
  OperationType.CacheReadQuery,
  OperationType.CacheWriteQuery,
  OperationType.ClientReadQuery,
  OperationType.ClientWriteQuery,
];

export const fragmentSubTypes = [
  OperationType.CacheReadFragment,
  OperationType.CacheWriteFragment,
  OperationType.ClientReadFragment,
  OperationType.ClientWriteFragment,
];

export const FilterView = (props: IFilterView) => {
  const [results, setResults] = React.useState<string[]>([]);
  const [types, setTypes] = React.useState<string[]>([]);
  const [statuses, setStatus] = React.useState<string[]>([]);
  const { setFilters } = props;
  const classes = useStyles();
  const onOperationChange = React.useCallback(
    ({ target: { value } }, { checked }) => {
      let arr = types.concat([]);
      if (checked) {
        console.log("checked", checked);
        arr.push(value);
      } else {
        arr = arr.filter((x) => x !== value);
      }
      setTypes(arr);
      console.log("types", types);
      setFilters({
        results,
        types: arr,
        statuses,
      });
    },
    [types, setTypes],
  );
  const onResultChange = React.useCallback(
    ({ target: { value } }, { checked }) => {
      let arr = results.concat([]);
      if (checked) {
        console.log("checked", checked);
        arr.push(value);
      } else {
        arr = arr.filter((x) => x !== value);
      }
      setResults(arr);
      console.log("results", results);
      setFilters({
        results: arr,
        types,
        statuses,
      });
    },
    [results, setResults],
  );
  const onStatusChange = React.useCallback(
    ({ target: { value } }, { checked }) => {
      let arr = statuses.concat([]);
      if (checked) {
        console.log("checked", checked);
        arr.push(value);
      } else {
        arr = arr.filter((x) => x !== value);
      }
      setStatus(arr);
      console.log("statuses", statuses);
      setFilters({
        results,
        types,
        statuses: arr,
      });
    },
    [statuses, setStatus],
  );
  const operations = Object.entries(OperationType)
    .filter(
      (value) =>
        !querySubTypes.includes(
          (value as unknown as Array<string>)[0] as OperationType,
        ),
    )
    .filter(
      (value) =>
        !fragmentSubTypes.includes(
          (value as unknown as Array<string>)[0] as OperationType,
        ),
    )
    .map((value, key) => {
      const checkboxValue = (value as unknown as Array<string>)[0];
      return (
        <Checkbox
          onChange={onOperationChange}
          value={checkboxValue}
          label={checkboxValue}
          key={key}
        />
      );
    });

  const statues = Object.entries(OperationStatus).map((value, key) => {
    const checkboxValue = (value as unknown as Array<string>)[0];
    return (
      <Checkbox
        onChange={onStatusChange}
        value={checkboxValue}
        label={checkboxValue}
        key={key}
      />
    );
  });

  const resultsFrom = Object.entries(ResultsFrom).map((value, key) => {
    const checkboxValue = (value as unknown as Array<string>)[0];
    return (
      <Checkbox
        onChange={onResultChange}
        value={checkboxValue}
        label={checkboxValue}
        key={key}
      />
    );
  });
  return (
    <div className={classes.filterView}>
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderBottom: "0.5px solid grey",
          }}
        >
          <h3 key="operationType">{`Filters`}&nbsp;</h3>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderBottom: "0.5px solid grey",
          paddingBottom: "10px",
        }}
      >
        <div>
          <h5 key="operationType">{`Type`}&nbsp;</h5>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {operations}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderBottom: "0.5px solid grey",
          paddingBottom: "10px",
        }}
      >
        <div>
          <h5 key="operationType">{`Result`}&nbsp;</h5>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {resultsFrom}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <h5 key="operationType">{`Status`}&nbsp;</h5>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {statues}
        </div>
      </div>
    </div>
  );
};
