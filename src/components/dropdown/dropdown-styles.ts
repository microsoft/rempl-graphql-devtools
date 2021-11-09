import { createUseStyles } from "react-jss";
import { dropdownSlotClassNames } from "@fluentui/react-northstar";

export const useStyles = createUseStyles({
  container: {
    padding: "0.5rem 0.5rem 0",
  },
  adDropdown: {
    width: "50%",
    maxWidth: "30rem",
    [`& .${dropdownSlotClassNames.container}`]: {
      width: "100%",
    },
    [`& .${dropdownSlotClassNames.itemsList}`]: {
      width: "100%",
    },
  },
});
