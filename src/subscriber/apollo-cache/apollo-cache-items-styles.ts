import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  detailsContainer: {
    overflow: "hidden",
    borderTop: "1px solid #E1DFDD",
    padding: "1rem",
  },
  detailsValue: {
    overflow: "auto",
    flex: 1,
    height: "calc(100% - 35px)",
  },
  preStyles: {
    marginTop: 0,
    fontSize: "0.75rem",
  },
});
