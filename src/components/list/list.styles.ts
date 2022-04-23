import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    ...shorthands.overflow("hidden"),
    maxWidth: "220px",
  },
  searchContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    ...shorthands.padding("0.5rem", 0),
  },
  list: {
    overflowY: "auto",
    listStyleType: "none",
    ...shorthands.margin(0),
    ...shorthands.padding("5px"),
  },
  listItem: {
    cursor: "pointer",
    marginBottom: "3px",
    ...shorthands.padding("10px"),
    ...shorthands.borderRadius("6px"),
    ...shorthands.overflow("hidden"),
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: "#F5F5F6",
      color: "#000",
    },
  },
  listItemActive: {
    backgroundColor: "#F5F5F6",
  },
});
