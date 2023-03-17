import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  gridBody: {
    position: "relative",
    willChange: "transform",
    direction: "ltr",
    cursor: "pointer",
    width: "100%",
    height: "100%",
    overflowY: "scroll",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
  gridRow: {
    ":hover": {
      backgroundColor: "unset",
      color: "unset",
    },
  },
  gridHeader: {
    ":hover": {
      backgroundColor: "unset !important",
      color: "unset !important",
    },
  },
  gridView: {
    display: "flex",
    height: "100%",
    "&:hover": {
      backgroundColor: "unset !important",
      color: "unset !important",
    },
  },
  selectedAndFailedRow: {
    color: "darkred",
    backgroundColor: "darkgrey",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "darkgrey",
      color: "darkred",
    },
  },
  failedRow: {
    "&:hover": {
      backgroundColor: "unset",
      color: "red",
    },
    color: "red",
  },
  selectedRow: {
    backgroundColor: "darkgrey",
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "darkgrey",
      color: "white",
    },
  },
  operationText: {
    ...shorthands.overflow("hidden"),
    width: "240px",
    display: "block",
  },
});
