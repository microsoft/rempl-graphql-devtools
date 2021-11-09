import {
  listItemClassName,
  accordionTitleClassName,
} from "@fluentui/react-northstar";
import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  container: {
    overflow: "auto",
    [`& .${accordionTitleClassName}`]: {
      position: "sticky",
      zIndex: 999,
      background: "#FBF6D9",
      borderBottom: "1px solid #835C00",
      fontWeight: "bold",
      padding: "0.313rem 0",
    },
    [`& .${listItemClassName}`]: {
      minHeight: "2rem",
    },
  },
});
