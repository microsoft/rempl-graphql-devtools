import { makeStyles, shorthands } from "@fluentui/react-components";
import { createUseStyles } from "react-jss";

export const useStyles = makeStyles({
  container: {
    display: "flex",
    alignItems: "center",
    ...shorthands.padding("0.5rem", "0.5rem", 0),
  },
  adDropdown: {
    width: "50%",
    maxWidth: "30rem",
    // [`& .${dropdownSlotClassNames.container}`]: {
    //   width: "100%",
    //   background: '#E9E8E8',
    // },
    // [`& .${dropdownSlotClassNames.itemsList}`]: {
    //   width: "100%",
    // },
  },
});
