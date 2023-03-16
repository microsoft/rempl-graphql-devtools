import { DocumentNode, getOperationAST } from "graphql";

export const getOperationName = (query: DocumentNode) => {
  const definition = getOperationAST(query);
  const operationName = definition ? definition.name?.value : "name_not_found";

  return operationName;
};

export const isNumber = (input: string | number | undefined = "NA") => {
  const value = parseInt(input as string, 10);
  if (isNaN(value)) {
    return false;
  }

  return true;
};

export const copyToClipboard = async (obj: unknown) => {
  try {
    await window.navigator.clipboard.writeText(JSON.stringify(obj));
  } catch (error) {
    console.log(`failed to copy`, error);
  }
};
