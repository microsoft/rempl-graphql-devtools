import {
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableCellLayout,
  createTableColumn,
  useScrollbarWidth,
  useFluent,
  Text,
} from "@fluentui/react-components";
import * as React from "react";
import {
  EditRegular,
  ReadingListRegular,
  PipelineRegular,
  DatabaseLinkRegular,
  BookDatabaseRegular,
  DatabaseSearchRegular,
  DatabaseRegular,
  BookOpenRegular,
  BookLetterRegular,
} from "@fluentui/react-icons";
import { IOperationResult, IOperation, OperationType } from "apollo-inspector";
import { useStyles } from "./data-grid-view.styles";
import { IReducerAction, ReducerActionEnum } from "../operations-tracker-body";
import {
  FilterView,
  fragmentSubTypes,
  IFilterSet,
  querySubTypes,
} from "./filter-view";
import {
  secondsToTime,
  sizeInBytes,
} from "../utils/apollo-operations-tracker-utils";

type Duration = {
  totalTime: number;
};

type Timing = {
  queuedAt: number;
  dataWrittenToCacheCompletedAt: number;
  responseReceivedFromServerAt: number;
};

type Result = {
  size: number;
};

type Item = {
  operationType: string;
  operationName: string;
  isActive: boolean;
  duration: Duration;
  timing: Timing;
  status: string;
  fetchPolicy: string;
  result: Result[];
  id: number;
};

export interface IDataGridView {
  operations: IOperation[] | null;
  searchText: string;
  setSelectedOperation: React.Dispatch<
    React.SetStateAction<IOperation | undefined>
  >;
  selectedOperation: IOperation | undefined;
  dispatchOperationsCount: React.Dispatch<IReducerAction>;
  updateOperations: ({
    operations,
    filteredOperations,
  }: {
    operations: IOperation[];
    filteredOperations: IOperation[];
  }) => void;
}

const getOperationIcon = (type: string) => {
  switch (type) {
    case OperationType.Query: {
      return <ReadingListRegular />;
    }
    case OperationType.Mutation: {
      return <EditRegular />;
    }
    case OperationType.Subscription: {
      return <PipelineRegular />;
    }
    case OperationType.CacheReadQuery: {
      return <DatabaseSearchRegular />;
    }
    case OperationType.CacheWriteQuery: {
      return <DatabaseLinkRegular />;
    }
    case OperationType.CacheReadFragment: {
      return <BookDatabaseRegular />;
    }
    case OperationType.CacheWriteFragment: {
      return <DatabaseRegular />;
    }
    case OperationType.ClientReadFragment: {
      return <BookOpenRegular />;
    }
    case OperationType.ClientWriteFragment: {
      return <BookLetterRegular />;
    }
  }
  return null;
};

const getColumns = (
  anyOperationSelected: boolean,
  classes: Record<
    | "gridRow"
    | "gridBody"
    | "gridHeader"
    | "gridView"
    | "selectedAndFailedRow"
    | "failedRow"
    | "selectedRow"
    | "operationText",
    string
  >,
) => {
  if (anyOperationSelected) {
    return [
      createTableColumn<Item>({
        columnId: "operationType",
        renderHeaderCell: () => {
          return "Type";
        },
        compare: (a, b) => {
          return a.operationType.localeCompare(b.operationType);
        },
        renderCell: (item) => {
          return (
            <TableCellLayout
              truncate
              media={getOperationIcon(item.operationType)}
            >
              {item.operationType}
            </TableCellLayout>
          );
        },
      }),
      createTableColumn<Item>({
        columnId: "operationName",
        renderHeaderCell: () => {
          return "Name";
        },
        compare: (a, b) => {
          return a.operationName.localeCompare(b.operationName);
        },
        renderCell: (item) => {
          return (
            <TableCellLayout truncate>
              <Text truncate wrap={false} className={classes.operationText}>
                {item.operationName}
              </Text>
            </TableCellLayout>
          );
        },
      }),
      createTableColumn<Item>({
        columnId: "operationType",
        renderHeaderCell: () => {
          return "Type";
        },
        compare: (a, b) => {
          return a.operationType.localeCompare(b.operationType);
        },
        renderCell: (item) => {
          return (
            <TableCellLayout
              truncate
              media={getOperationIcon(item.operationType)}
            >
              {item.operationType}
            </TableCellLayout>
          );
        },
      }),
    ];
  }
  return [
    createTableColumn<Item>({
      columnId: "operationName",
      renderHeaderCell: () => {
        return "Name";
      },
      compare: (a, b) => {
        return a.operationName.localeCompare(b.operationName);
      },
      renderCell: (item) => {
        return <TableCellLayout truncate>{item.operationName}</TableCellLayout>;
      },
    }),
    createTableColumn<Item>({
      columnId: "operationType",
      renderHeaderCell: () => {
        return "Type";
      },
      compare: (a, b) => {
        return a.operationType.localeCompare(b.operationType);
      },
      renderCell: (item) => {
        return (
          <TableCellLayout
            truncate
            media={getOperationIcon(item.operationType)}
          >
            {item.operationType}
          </TableCellLayout>
        );
      },
    }),
  ];
};

const getFilteredItems = (
  items: IOperation[] | null | undefined,
  searchText: string,
  filters: IFilterSet | null,
) => {
  console.log("filters called with value", filters);
  let filteredItems = items || [];
  if (searchText.length > 0) {
    const tokens = searchText
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x !== "");
    filteredItems =
      tokens.length > 0
        ? filteredItems.filter((item) => {
            return tokens.find((x) =>
              item.operationName?.toLowerCase().includes(x),
            );
          })
        : filteredItems;
  }
  if (filters) {
    // filtering based on types
    let filterTypes = filters.types.concat([]).map((x) => x.toLowerCase());
    if (filterTypes.includes(OperationType.Query.toLowerCase())) {
      filterTypes = filterTypes.concat(querySubTypes);
    }
    if (filterTypes.includes(OperationType.Fragment.toLowerCase())) {
      filterTypes = filterTypes.concat(fragmentSubTypes);
    }
    if (filterTypes.length > 0) {
      filteredItems = filteredItems.filter((item) =>
        filterTypes.includes(item.operationType.toLowerCase()),
      );
    }

    // filtering based on results
    // const results = filters.results.concat([]).map((x) => x.toLowerCase());
    // if (results.length > 0) {
    //   filteredItems = filteredItems.filter((item) => {
    //     const fromResult = (item.result?.[0] as IOperationResult)?.from;
    //     return results.includes((fromResult || "").toLowerCase());
    //   });
    // }

    // // filtering based on status
    // const statuses = filters.statuses.concat([]).map((x) => x.toLowerCase());
    // if (statuses.length > 0) {
    //   filteredItems = filteredItems.filter((item) =>
    //     statuses.includes(item.status.toLowerCase()),
    //   );
    // }
  }
  return filteredItems;
};

export const DataGridView = (props: IDataGridView) => {
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });
  const classes = useStyles();
  const {
    operations,
    searchText,
    selectedOperation,
    setSelectedOperation,
    dispatchOperationsCount,
    updateOperations,
  } = props;

  const filteredOperations: IOperation[] = props.operations?.concat([]) ?? [];

  const [filters, setFilters] = React.useState<IFilterSet | null>(null);
  const [selectedOperations, setSelectedOperations] = React.useState<
    IOperation[]
  >([]);

  const filteredItems = operations || [];

  const columns = React.useMemo(
    () => getColumns(!!selectedOperation, classes),
    [selectedOperation],
  );

  React.useEffect(() => {
    updateOperations({
      operations: selectedOperations,
      filteredOperations: filteredItems,
    });
  }, [filteredItems, selectedOperation]);

  React.useEffect(() => {
    dispatchOperationsCount({
      type: ReducerActionEnum.UpdateVerboseOperationsCount,
      value: filteredItems?.length,
    });
  }, [searchText, operations, dispatchOperationsCount, filteredItems]);

  const operationsMap = React.useMemo(() => {
    const map = new Map<number, IOperation>();
    filteredOperations?.forEach((op, index) => {
      map.set(index, op);
    });
    return map;
  }, [filteredOperations]);

  const onClick = React.useCallback(
    (item) => {
      const operation = operationsMap.get(item.id);
      setSelectedOperation(operation);
    },
    [setSelectedOperation, filteredOperations],
  );

  const updateFilters = React.useCallback(
    (input: IFilterSet | null) => {
      console.log("setting filters", input);
      setFilters(input);
    },
    [setFilters],
  );

  const updateVerboseOperations = React.useCallback(
    (e, { selectedItems }) => {
      const operations: IOperation[] = [];
      [...selectedItems].forEach((index) =>
        operations.push(filteredItems[index]),
      );

      setSelectedOperations(operations);

      console.log(operations, filteredItems, [...selectedItems]);
      updateOperations({
        operations,
        filteredOperations: filteredItems,
      });
    },
    [updateOperations, filteredItems],
  );

  return (
    <div className={classes.gridView}>
      <div>
        <FilterView setFilters={updateFilters} />
      </div>
      <DataGrid
        items={filteredItems as any}
        columns={columns}
        focusMode="cell"
        sortable
        resizableColumns
        onColumnResize={(event, { columnId, width }) => {
          if (event instanceof MouseEvent) {
            console.log(event.offsetX, event.offsetY, columnId, width);
          }
        }}
        columnSizingOptions={{
          id: {
            minWidth: 60,
            defaultWidth: 120,
          },
          operationType: {
            minWidth: 120,
            defaultWidth: 120,
          },
        }}
        selectionMode="multiselect"
        onSelectionChange={updateVerboseOperations}
      >
        <DataGridHeader
          style={{
            paddingRight: scrollbarWidth,
            backgroundColor: "#e0e0e0",
          }}
          className={classes.gridHeader}
        >
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody className={classes.gridBody}>
          {({ item, rowId }, style) => {
            const isRowSelected = false; //selectedOperation?.id === (item as Item).id;
            const isFailed = false;
            const rowClassName =
              isRowSelected && isFailed
                ? classes.selectedAndFailedRow
                : isFailed
                ? classes.failedRow
                : isRowSelected
                ? classes.selectedRow
                : classes.gridRow;
            return (
              <DataGridRow<Item>
                key={rowId}
                style={style as React.CSSProperties}
                onClick={() => onClick(item)}
                className={rowClassName}
              >
                {({ renderCell }) => (
                  <DataGridCell>{renderCell(item as Item)}</DataGridCell>
                )}
              </DataGridRow>
            );
          }}
        </DataGridBody>
      </DataGrid>
    </div>
  );
};
