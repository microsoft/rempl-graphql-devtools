import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  root: {
    flexShrink: 1,
    flexGrow: 1,
    flexBasic: 0,
    height: "calc(100% - 15px)",
    ...shorthands.padding("10px"),
  },
  innerContainer: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: "50px 0 auto",
    height: "100%",
    backgroundColor: "#fff",
    ...shorthands.borderRadius("6px"),
    ...shorthands.overflow("hidden"),
  },
  innerContainerDescription: {
    gridTemplateRows: "50px 50px auto",
  },
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
    ...shorthands.padding("5px", "15px"),
    visibility: "hidden",
    height: 0,
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
