import { makeStyles, shorthands } from "@fluentui/react-components";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    ...shorthands.overflow("auto"),
    ...shorthands.borderLeft("1px", "solid", "#E1DFDD"),
    ...shorthands.padding(0, "1rem"),
  },
  header: {
    display: "flex",
    alignItems: "center",
    ...shorthands.padding("10px", 0)
  },
  title: {
    color: "#97CBFF",
  },
  controlButton: {
    minWidth: "auto",
    marginRight: "10px",
    ...shorthands.padding(0, "5px"),
  },
  codeBox: {
    backgroundColor: "#F5F5F6",
    fontSize: "11px",
    ...shorthands.borderRadius("6px"),
    ...shorthands.padding("5px"),
    ...shorthands.margin("5px", 0)
  }
});
