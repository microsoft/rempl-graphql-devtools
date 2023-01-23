import { ApolloLink, Observable, FetchResult } from "@apollo/client";
import { RemplWrapper } from "../rempl-wrapper";
import {
  ApolloInspector,
  IInspectorTrackingConfig,
  IHook,
  IVerboseOperation,
} from "apollo-inspector";
import { ApolloOperationsTrackerPublisher } from "./apollo-operations-tracker-publisher";

export class ApolloOperationsTrackerTMPPublisher extends ApolloOperationsTrackerPublisher {
  constructor(remplWrapper: RemplWrapper) {
    super(remplWrapper);
  }

  protected attachMethodsToPublisher() {
    this.apolloPublisher.provide(
      "startOperationsTracker",
      (options: IInspectorTrackingConfig | undefined) => {
        if (this.activeClient) {
          this.isRecording = true;
          const inspector = new ApolloInspector(this.activeClient);
          if (options && Object.keys(options).length === 0) {
            options = undefined;
          }
          options = this.addCDLInspectorHook(options);
          this.stopTracking = inspector.startTracking(
            options as unknown as IInspectorTrackingConfig,
          );
        }
      },
    );

    this.apolloPublisher.provide("stopOperationsTracker", () => {
      if (this.stopTracking) {
        this.isRecording = false;
        const data = this.stopTracking?.();
        this.publishApolloOperations(data);
        this.stopTracking = undefined;
      }
    });
  }

  private addCDLInspectorHook(options: IInspectorTrackingConfig | undefined) {
    if (options) {
      if (options.hooks) {
        options.hooks = [...options.hooks, new CDLInspectorHook()];
        return options;
      } else {
        options.hooks = [new CDLInspectorHook()];
        return options;
      }
    } else {
      options = {
        tracking: {
          trackCacheOperation: false,
          trackVerboseOperations: false,
          trackAllOperations: true,
        },
        hooks: [new CDLInspectorHook()],
      } as unknown as IInspectorTrackingConfig;
      return options;
    }
  }
}

interface ITimeInfo {
  windowToWorkerRequestSendTime?: DOMHighResTimeStamp;
  windowToWorkerRequestReceviedTime?: DOMHighResTimeStamp;
  workerToWindowRequestSendTime?: DOMHighResTimeStamp;
  workerToWindowRequestReceiveTime?: DOMHighResTimeStamp;
  workerResponseTime?: DOMHighResTimeStamp;
}

interface IResult {
  extensions?: IExtensions;
}
interface IError {
  extensions?: IExtensions;
}

export interface IExtensions {
  perfStats: {
    requestReceivedTime: number;
    responseSendTime: number;
    workerResponseTime: number;
  };
}

class CDLInspectorHook implements IHook {
  private operationsMap: Map<number, ITimeInfo>;
  private decimalNumber = 2;

  constructor() {
    this.operationsMap = new Map();
  }
  public getLink(cb: () => number): ApolloLink {
    const link = new ApolloLink((op, forward) => {
      const windowToWorkerRequestSendTime = performance.now();
      const operationId = cb();
      this.operationsMap.set(operationId, { windowToWorkerRequestSendTime });
      const obs: Observable<
        FetchResult<
          Record<string, any>,
          Record<string, any>,
          Record<string, any>
        >
      > = forward(op);
      obs.subscribe({
        next: (
          result: FetchResult<
            Record<string, any>,
            Record<string, any>,
            Record<string, any>
          >,
        ) => {
          const typedResult = result as IResult;
          const opId = cb();
          if (opId !== 0 && typedResult.extensions?.perfStats) {
            const timeInfo = this.getExitingTimeInfo(cb);
            const perfStatsAddedTimeInfo = this.addPerfStatsToTimeInfo(
              typedResult.extensions,
              timeInfo,
            );
            this.operationsMap.set(opId, perfStatsAddedTimeInfo);
          }
        },
        error: (error) => {
          const typedError = error as IError;
          const opId = cb();

          if (opId !== 0 && typedError.extensions?.perfStats) {
            const timeInfo = this.getExitingTimeInfo(cb);
            const perfStatsAddedTimeInfo = this.addPerfStatsToTimeInfo(
              typedError.extensions,
              timeInfo,
            );
            this.operationsMap.set(opId, perfStatsAddedTimeInfo);
          }
        },
      });

      return obs;
    });

    return link;
  }

  public transform(op: IVerboseOperation) {
    const operationId = op.id;
    const windowToWorkerIpcTime: DOMHighResTimeStamp | string =
      this.getWindowToWorkerIpcTime(operationId);
    const workerToWindowIpcTime: DOMHighResTimeStamp | string =
      this.getWorkerToWindowIpcTime(operationId);
    const ipcTime: DOMHighResTimeStamp | string = this.getIpcTime(operationId);
    const timeSpentInWorker: DOMHighResTimeStamp | string =
      this.getTimeSpentInWorker(operationId);

    op.duration = {
      ...op.duration,
      windowToWorkerIpcTime,
      workerToWindowIpcTime,
      ipcTime,
      timeSpentInWorker,
    } as any;
    return op;
  }

  private getTimeSpentInWorker(operationId: number): string | number {
    const timeInfo = this.operationsMap.get(operationId);
    if (!timeInfo) {
      return "NA";
    }
    if (timeInfo.workerResponseTime) {
      const time = timeInfo.workerResponseTime;

      if (!isNaN(time)) {
        return parseFloat(time.toFixed(this.decimalNumber));
      }
    }

    return "NA";
  }

  private getIpcTime(operationId: number): string | number {
    const timeInfo = this.operationsMap.get(operationId);
    if (!timeInfo) {
      return "NA";
    }
    const {
      windowToWorkerRequestSendTime,
      workerToWindowRequestReceiveTime,
      workerResponseTime,
    } = timeInfo;
    if (
      windowToWorkerRequestSendTime &&
      workerToWindowRequestReceiveTime &&
      workerResponseTime
    ) {
      const time =
        workerToWindowRequestReceiveTime -
        windowToWorkerRequestSendTime -
        workerResponseTime;

      if (!isNaN(time)) {
        return parseFloat(time.toFixed(this.decimalNumber));
      }
    }

    return "NA";
  }

  private getWindowToWorkerIpcTime(operationId: number): string | number {
    const timeInfo = this.operationsMap.get(operationId);
    if (!timeInfo) {
      return "NA";
    }
    if (
      timeInfo.windowToWorkerRequestReceviedTime &&
      timeInfo.windowToWorkerRequestSendTime
    ) {
      const time =
        timeInfo.windowToWorkerRequestReceviedTime -
        timeInfo.windowToWorkerRequestSendTime;

      if (!isNaN(time)) {
        return parseFloat(time.toFixed(this.decimalNumber));
      }
    }

    return "NA";
  }

  private getWorkerToWindowIpcTime(operationId: number): string | number {
    const timeInfo = this.operationsMap.get(operationId);
    if (!timeInfo) {
      return "NA";
    }
    if (
      timeInfo.workerToWindowRequestReceiveTime &&
      timeInfo.workerToWindowRequestSendTime
    ) {
      const time =
        timeInfo.workerToWindowRequestReceiveTime -
        timeInfo.workerToWindowRequestSendTime;

      if (!isNaN(time)) {
        return parseFloat(time.toFixed(this.decimalNumber));
      }
    }

    return "NA";
  }

  private getExitingTimeInfo(cb: () => number) {
    const operationId = cb();
    const timeInfo = this.operationsMap.get(operationId);
    if (!timeInfo) {
      return {};
    }
    return timeInfo;
  }
  private addPerfStatsToTimeInfo(extensions: IExtensions, timeInfo: ITimeInfo) {
    const { requestReceivedTime, responseSendTime, workerResponseTime } =
      extensions.perfStats;

    timeInfo.windowToWorkerRequestReceviedTime = requestReceivedTime;
    timeInfo.workerToWindowRequestSendTime = responseSendTime;
    timeInfo.workerToWindowRequestReceiveTime = performance.now();
    timeInfo.workerResponseTime = workerResponseTime;

    return timeInfo;
  }
}
