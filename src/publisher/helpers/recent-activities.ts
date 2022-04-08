import { uid } from "uid";

export const DATA_CHANGES = {
  ADDED: "added",
  REMOVED: "removed",
};

export function getRecentActivities(items: any[], lastIterationItems: any[]) {
  if (!lastIterationItems.length || !items.length) {
    return;
  }

  let index = 0;
  const result = [];
  for (const value of items) {
    const searchedValueIndex = lastIterationItems.indexOf(value);
    if (searchedValueIndex === -1) {
      result.push({ change: DATA_CHANGES.ADDED, id: uid(), data: value });
      continue;
    } else {
      if (searchedValueIndex > 0) {
        result.push(
          ...lastIterationItems.slice(0, searchedValueIndex).map((data) => ({
            id: uid(),
            change: DATA_CHANGES.REMOVED,
            data,
          }))
        );
      }

      lastIterationItems.splice(searchedValueIndex, searchedValueIndex + 1);
    }
  }
  result.push(
    ...lastIterationItems.map((data) => ({
      id: uid(),
      change: DATA_CHANGES.REMOVED,
      data,
    }))
  );

  return result;
}
