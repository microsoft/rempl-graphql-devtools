import { createUseStyles } from "react-jss";
import { listItemClassName } from "@fluentui/react-northstar";

export const useStyles = createUseStyles({
  container: {
    overflow: "hidden",
    maxWidth: "300px",

    [`& .${listItemClassName}`]: {
      minHeight: "2rem",
    },
  },
  input: {
    width: "100%",
    padding: "0.5rem",
  },
  list: {
    overflowY: "auto",
    height: "calc(100% - 48px)",
  },
});
