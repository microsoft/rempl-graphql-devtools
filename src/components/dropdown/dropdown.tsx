import React from "react";
import { useStyles } from "./dropdown.styles";
import { mergeClasses, Text } from "@fluentui/react-components";
import { ChevronDown20Regular, ChevronUp20Regular} from "@fluentui/react-icons";

export const Dropdown = React.memo((props: any) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(false);

  const onChange = (e: any, value: any) => {
    props.onChange(e, {value});
    setIsOpen(!isOpen);
  }

  return (
    <div
      className={classes.container}
      id="apollo-client-dropdown"
    >
      <Text weight="semibold">Apollo client:</Text>
      <div className={classes.dropdown}>
        <div 
          tabIndex={0}
          className={classes.dropdownValue}
          onClick={() => setIsOpen(!isOpen)}>
          <Text>{props.value}</Text>
          {isOpen ? <ChevronUp20Regular /> : <ChevronDown20Regular />}
        </div>
        <div className={mergeClasses(
          classes.dropdownContent, 
          isOpen && classes.dropdownContentOpen
        )}>
          {props.items.map((elem: string, index: number) => (
            <Text 
              block
              key={`ddItem-${index}`}
              className={classes.dropdownItem}
              onClick={(e) => onChange(e, elem)}>{elem}</Text>
          ))}
        </div>
      </div>
    </div>
  );
});
