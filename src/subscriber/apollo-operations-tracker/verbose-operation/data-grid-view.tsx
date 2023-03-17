import * as React from "react";
import { useScrollbarWidth, useFluent } from "@fluentui/react-components";
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
} from "@fluentui/react-data-grid-react-window";
import { IVerboseOperation } from "apollo-inspector";
import { useStyles } from "./data-grid-view.styles";
import { IReducerAction, ReducerActionEnum } from "../operations-tracker-body";
import { FilterView, IFilterSet } from "./filter-view";
import { throttle } from "lodash";
import { getColumns, getFilteredItems, Item } from "./data-grid-view-helper";

export interface IDataGridView {
  operations: IVerboseOperation[] | null;
  searchText: string;
  setSelectedOperation: React.Dispatch<
    React.SetStateAction<IVerboseOperation | undefined>
  >;
  selectedOperation: IVerboseOperation | undefined;
  dispatchOperationsCount: React.Dispatch<IReducerAction>;
  updateOperations: ({
    operations,
    filteredOperations,
  }: {
    operations: IVerboseOperation[];
    filteredOperations: IVerboseOperation[];
  }) => void;
}

const ItemSize = 40;

export const DataGridView = (props: IDataGridView) => {
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });
  const [gridHeight, setGridHeight] = React.useState(400);
  const divRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const height = divRef.current?.getBoundingClientRect().height;
    setGridHeight(height ? height - ItemSize : 400);
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const height = divRef.current?.getBoundingClientRect().height;
        setGridHeight(height ? height - ItemSize : 400);
      }, 200),
    );
    if (divRef.current) {
      resizeObserver.observe(divRef.current);
      return () => {
        if (divRef.current) {
          resizeObserver.unobserve(divRef.current);
        }
      };
    }
  }, [divRef.current, setGridHeight]);

  const classes = useStyles();
  const {
    operations,
    searchText,
    selectedOperation,
    setSelectedOperation,
    dispatchOperationsCount,
    updateOperations,
  } = props;

  const filteredOperations: IVerboseOperation[] =
    props.operations?.concat([]) ?? [];

  const [filters, setFilters] = React.useState<IFilterSet | null>(null);
  const [selectedOperations, setSelectedOperations] = React.useState<
    IVerboseOperation[]
  >([]);

  const filteredItems = React.useMemo(
    () => getFilteredItems(operations, searchText, filters),
    [filters, searchText, operations],
  );

  const columns = React.useMemo(
    () => getColumns(!!selectedOperation, classes),
    [selectedOperation, classes],
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
    const map = new Map<number, IVerboseOperation>();
    filteredOperations?.forEach((op) => {
      map.set(op.id, op);
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
      setFilters(input);
    },
    [setFilters],
  );

  const updateVerboseOperations = React.useCallback(
    (e, { selectedItems }) => {
      const operations: IVerboseOperation[] = [];
      [...selectedItems].forEach((index) =>
        operations.push(filteredItems[index]),
      );

      setSelectedOperations(operations);

      updateOperations({
        operations,
        filteredOperations: filteredItems,
      });
    },
    [updateOperations, filteredItems],
  );

  return (
    <div className={classes.gridView} ref={divRef}>
      <div>
        <FilterView setFilters={updateFilters} />
      </div>
      <div {...(selectedOperation ? { className: classes.gridWrapper } : {})}>
        <DataGrid
          items={filteredItems as any}
          columns={columns}
          focusMode="cell"
          sortable
          resizableColumns
          columnSizingOptions={{
            id: {
              minWidth: 20,
              defaultWidth: 30,
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
          <DataGridBody
            className={classes.gridBody}
            itemSize={40}
            height={gridHeight}
          >
            {({ item, rowId }, style) => {
              const isRowSelected = selectedOperation?.id === (item as Item).id;
              const isFailed = (item as Item).status
                .toLowerCase()
                .includes("failed");
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
    </div>
  );
};
