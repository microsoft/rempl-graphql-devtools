export interface IReducerState {
  verboseOperationsCount: number;
  allOperationsCount: number;
  cacheOperationsCount: number;
}

export enum ReducerActionEnum {
  UpdateVerboseOperationsCount,
  UpdateAllOperationsCount,
  UpdateCacheOperationsCount,

  ClearVerboseOperations,
}

export interface IReducerAction {
  type: ReducerActionEnum;
  value: any;
}
