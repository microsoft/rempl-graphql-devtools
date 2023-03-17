import { IDataView, IVerboseOperation } from "apollo-inspector";

export interface IError {
  error: any;
  message: string;
}

export interface ILoader {
  message: string;
  loading: boolean;
}

export type stylesClasses =
  | "root"
  | "innerContainer"
  | "innerContainerDescription"
  | "name"
  | "label"
  | "centerDiv";

export interface IUseMainSlotParams {
  error: IError | null;
  loader: ILoader;
  apollOperationsData: IDataView | null;
  searchText: string;
  updateOperations: ({
    operations,
    filteredOperations,
  }: {
    operations: IVerboseOperation[];
    filteredOperations: IVerboseOperation[];
  }) => void;
}

export interface IUseMainSlotService {
  classes: Record<stylesClasses, string>;
}
