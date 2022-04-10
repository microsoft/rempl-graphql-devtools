import rempl from "rempl";
import hotkeys from "hotkeys-js";
import { ClientObject } from "../types";

type RemplStatusHook = {
  id: string;
  timeout: number;
  callback: (
    clientObjects: ClientObject[],
    activeClient: ClientObject | null
  ) => void;
};

export class RemplWrapper {
  private static _instance: RemplWrapper | null;
  private isRemplActive = false;
  private remplStatusHooks: RemplStatusHook[] = [];
  private activeClient: ClientObject | null = null;
  private checkIntervals: {
    id: string;
    interval: ReturnType<typeof setInterval>;
  }[] = [];

  constructor(enableRemplHotkey: string) {
    if (RemplWrapper._instance) {
      return RemplWrapper._instance;
    }
    hotkeys(enableRemplHotkey, () => {
      this.toggleStatus();
    });
  }

  public subscribeToRemplStatus(
    id: string,
    callback: (
      clientObjects: ClientObject[],
      activeClientId: ClientObject | null
    ) => void,
    timeout: number
  ) {
    this.remplStatusHooks.push({ id, callback, timeout });
  }

  public unSubscribeToRemplStatus(idToCheck: string) {
    this.remplStatusHooks.filter(({ id }) => idToCheck !== id);
    this.checkIntervals.filter(({ id }) => {
      const result = idToCheck !== id;
      if (!result) {
        this.clearIntervalById(id);
      }
    });
  }

  public getRempl() {
    return rempl;
  }

  public attachMethodsToPublisher(apolloPublisher: any) {
    apolloPublisher.provide(
      "setActiveClientId",
      ({ clientId }: { clientId: string }, callback: () => void) => {
        this.clearIntervals();
        this.activeClient = this.getClientById(clientId);
        this.runAllHooks();
        callback();
      }
    );
  }

  private getClientById(activeClientId: string) {
    if (!window.__APOLLO_CLIENTS__?.length) {
      return null;
    }

    const activeClient = window.__APOLLO_CLIENTS__.find(
      (client: ClientObject) => client.clientId === activeClientId
    );

    if (!activeClient) {
      return null;
    }

    return activeClient;
  }

  private intervalExists(idToCheck: string) {
    return this.checkIntervals.some(({ id }) => id === idToCheck);
  }

  public runAllHooks() {
    if (!window.__APOLLO_CLIENTS__?.length) {
      return;
    }

    for (const { id, callback, timeout } of this.remplStatusHooks) {
      if (this.intervalExists(id)) {
        return;
      }

      callback(window.__APOLLO_CLIENTS__, this.activeClient);

      this.checkIntervals.push({
        id: id,
        interval: setInterval(() => {
          callback(window.__APOLLO_CLIENTS__, this.activeClient);
        }, timeout),
      });
    }
  }

  private clearIntervalById(idToCheck: string) {
    for (const { id, interval } of this.checkIntervals) {
      if (id === idToCheck) {
        clearInterval(interval);
      }
    }
    this.checkIntervals = [];
  }

  private clearIntervals() {
    for (const { interval } of this.checkIntervals) {
      clearInterval(interval);
    }
    this.checkIntervals = [];
  }

  private toggleStatus() {
    this.isRemplActive = !this.isRemplActive;
    this.clearIntervals();

    if (this.isRemplActive) {
      rempl.getHost().activate();

      this.runAllHooks();

      return;
    }

    rempl.getHost().deactivate();
  }
}
