import { makeStyles, shorthands } from "@fluentui/react-components";

export const watchedQueriesStyles = makeStyles({
    root: {
        flexShrink: 1,
        flexGrow: 1,
        flexBasic: 0,
        height: "100%",
        ...shorthands.padding("10px"),
    },
    innerContainer: {
        display: "flex",
        height: "100%",
        backgroundColor: "#fff",
        ...shorthands.borderRadius("6px"),
    },
    error: {
        color: 'red'
    }
});