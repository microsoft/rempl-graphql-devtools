import { createUseStyles } from "react-jss";
import {
  listItemClassName,
  listItemContentClassName,
  listItemSlotClassNames,
} from "@fluentui/react-northstar";

export const useStyles = createUseStyles({
  container: {
    margin: "0.5rem 0",
  },
  listMenu: {
    [`& .${listItemClassName}`]: {
      minHeight: "2rem",
      borderRight: "1px solid #E1DFDD",
      padding: 0,
      color: "white",
      "&:hover": {
        color: "black",
      },
    },
    [`& .${listItemSlotClassNames.main}`]: {
      height: "100%",
    },
    [`& .${listItemSlotClassNames.contentWrapper}`]: {
      height: "100%",
    },
    [`& .${listItemContentClassName}`]: {
      height: "100%",
      marginRight: 0,
    },
  },
});
