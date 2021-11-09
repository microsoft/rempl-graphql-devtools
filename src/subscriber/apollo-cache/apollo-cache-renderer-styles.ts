import { dropdownSlotClassNames } from "@fluentui/react-northstar";
import { createUseStyles } from "react-jss";

export const useStyles = createUseStyles({
  topBar: {
    margin: "0.5rem 1rem",
  },
  topBarActions: {
    borderLeft: "1px solid #E1DFDD",
    paddingLeft: "0.5rem",
  },
  switchDropdown: {
    width: "165px",
    marginRight: "1.25rem",
    [`& .${dropdownSlotClassNames.container}`]: {
      width: "100%",
    },
    [`& .${dropdownSlotClassNames.itemsList}`]: {
      width: "100%",
    },
  },
  activeRecord: {
    color: "#C4314B !important",
    background: "rgba(196, 49, 75, 0.2) !important",
  },
  infoPanel: {
    width: "100%",
    position: "fixed !important",
    bottom: 0,
  },
});
