export const useAutoContainerHeight = () => {
  // Dropdown height
  const acDropdown = document.getElementById("apollo-client-dropdown");
  const acDropdownHeight = acDropdown
    ? acDropdown.getBoundingClientRect().height
    : 0;
  // Menu height
  const menu = document.getElementById("menu-container");
  let menuHeight = 0;
  if (menu) {
    const styles = window.getComputedStyle(menu);
    const margin =
      parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);
    menuHeight = menu.getBoundingClientRect().height + margin;
  }
  return acDropdownHeight + menuHeight;
};
