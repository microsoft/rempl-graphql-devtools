import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    flexShrink: 1,
    flexGrow: 1,
    flexBasic: 0,
    ...shorthands.padding("10px"),
    display: "flex",
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "auto",
    ...shorthands.borderRadius("6px"),
    ...shorthands.overflow("hidden"),
  },
  innerContainerDescription: {},
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...shorthands.padding("10px", "15px"),
  },
  infoButton: {
    minWidth: "auto",
    marginRight: "5px",
    ...shorthands.padding(0, "5px"),
    "&:hover": {
      color: "#97CBFF",
    },
  },
  description: {
    ...shorthands.padding("0px", "15px"),
  },
  openDescription: {
    visibility: "visible",
    height: "auto",
    ...shorthands.overflow("hidden", "auto"),
  },
  name: {
    ...shorthands.overflow("hidden"),
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  label: {
    display: "inline-block",
    ...shorthands.padding("5px", "10px"),
    ...shorthands.borderRadius("12px"),
    ...shorthands.borderStyle("none"),
  },
});
