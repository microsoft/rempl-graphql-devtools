import { makeStyles, shorthands } from "@fluentui/react-components";

export const menuStyles = makeStyles({
    root: {
        position: "relative",
        width: "75px",
    },
    menuList: {
        listStyleType: "none",
        ...shorthands.padding(0),
        ...shorthands.margin("15px", "5px")
    },
    menuItem: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        alignItems: "center",
        color: "#919191",
        textDecorationLine: "none",
        ...shorthands.padding("5px", "12px"),
        ...shorthands.margin("3px", 0),
        ...shorthands.borderRadius("6px"),
        "&:hover": {
            color: "#757575",
            backgroundColor: "#EAEAEA",
        },
    },
    menuItemActive: {
        backgroundColor: "#fff",
        color: "#242424",
    },
    menuItemIcon: {
        width: "20px",
        display: "flex",
    },
    menuText: {
        fontSize: "11px",
        lineHeight: 1.5,
        textAlign: "center"
    },
    badge: {
        position: "absolute",
        top: "-3px",
        right: "-6px"
    }
});
