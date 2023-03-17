import { makeStyles } from "@fluentui/react-components";

export const useStyles = makeStyles({
  filterView: {
    display: "flex",
    flexDirection: "column",
    overflowY: "scroll",
    paddingLeft: "10px",
    backgroundColor: "#d6d6d6",
    paddingRight: "10px",
    height: "100%",
    "::-webkit-scrollbar": {
      display: "none",
    },
  },
});
