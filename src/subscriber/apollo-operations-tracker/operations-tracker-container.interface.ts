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
  | "header"
  | "infoButton"
  | "description"
  | "openDescription"
  | "name"
  | "label"
  | "centerDiv";
