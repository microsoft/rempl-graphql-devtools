import * as React from "react";
import {
  TableColumnDefinition,
  createTableColumn,
  TableCellLayout,
  useScrollbarWidth,
  useFluent,
  Text,
} from "@fluentui/react-components";
import { IDueToOperation } from "apollo-inspector";
import {
  DataGridBody,
  DataGrid,
  DataGridRow,
  DataGridHeader,
  DataGridCell,
  DataGridHeaderCell,
} from "@fluentui/react-data-grid-react-window";
import { useStyles } from "./affected-queries-grid-renderer-styles";

const ItemSize = 40;
export interface IAffectedQueriesGridRenderers {
  items: IDueToOperation[] | undefined;
}

export const AffectedQueriesGridRenderers = (
  props: IAffectedQueriesGridRenderers,
) => {
  const { items } = props;
  if (!items) {
    return null;
  }
  const { targetDocument } = useFluent();
  const scrollbarWidth = useScrollbarWidth({ targetDocument });
  const divRef = React.useRef<HTMLDivElement | null>(null);
  const [gridHeight, setGridHeight] = React.useState(400);
  const classes = useStyles();

  React.useEffect(() => {
    const height = divRef.current?.getBoundingClientRect().height;
    console.log({ height });
    setGridHeight(height ? height - ItemSize : 400);
  }, [divRef.current, setGridHeight]);

  console.log({ gridItemsAndSize: gridHeight });
  return (
    <div ref={divRef} className={classes.root}>
      <DataGrid
        items={items}
        columns={columns}
        focusMode="cell"
        resizableColumns
        columnSizingOptions={{
          operationName: { minWidth: 330, defaultWidth: 350 },
          id: { minWidth: 20, defaultWidth: 20 },
        }}
      >
        <DataGridHeader style={{ paddingRight: scrollbarWidth }}>
          <DataGridRow>
            {({ renderHeaderCell }) => (
              <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<IDueToOperation> itemSize={40} height={gridHeight}>
          {({ item, rowId }, style) => (
            <DataGridRow<IDueToOperation> key={rowId} style={style}>
              {({ renderCell }) => (
                <DataGridCell>{renderCell(item)}</DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
    </div>
  );
};

const columns: TableColumnDefinition<IDueToOperation>[] = [
  createTableColumn<IDueToOperation>({
    columnId: "id",
    compare: (a, b) => {
      return a.id - b.id;
    },
    renderHeaderCell: () => {
      return <Text weight="bold">{"Id"}</Text>;
    },
    renderCell: (item) => {
      return <TableCellLayout>{item.id}</TableCellLayout>;
    },
  }),
  createTableColumn({
    columnId: "Type",
    compare: (a, b) => {
      return a.operationType.localeCompare(b.operationType);
    },
    renderHeaderCell: () => {
      return <Text weight="bold">{"Type"}</Text>;
    },
    renderCell: (item) => {
      return <TableCellLayout>{item.operationType}</TableCellLayout>;
    },
  }),
  createTableColumn({
    columnId: "operationName",
    compare: (a, b) => {
      if (a.operationName) {
        return a.operationName?.localeCompare(b.operationName || "");
      }

      return 0;
    },
    renderHeaderCell: () => {
      return <Text weight="bold">{"Operation Name"}</Text>;
    },
    renderCell: (item) => {
      return <TableCellLayout truncate>{item.operationName}</TableCellLayout>;
    },
  }),
];
