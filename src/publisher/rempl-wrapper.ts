import rempl from "rempl";
import hotkeys from "hotkeys-js";
import { ClientObject } from "../types";

type RemplStatusHook = (clientObjects: ClientObject[]) => void;

export class RemplWrapper {
  private static _instance: RemplWrapper | null;
  private isRemplActive = false;
  private isAutoRefreshEnabled = true;
  private remplStatusHooks: RemplStatusHook[] = [];
  private checkInterval: null | ReturnType<typeof setInterval> = null;

  constructor(enableRemplHotkey: string) {
    if (RemplWrapper._instance) {
      return RemplWrapper._instance;
    }
    hotkeys(enableRemplHotkey, () => {
      this.toggleStatus();
    });
  }

  public subscribeToRemplStatus(remplStatusHook: RemplStatusHook) {
    this.remplStatusHooks.push(remplStatusHook);
  }

  public getRempl() {
    return rempl;
  }

  public runAllHooks() {
    if (!window.__APOLLO_CLIENTS__?.length) {
      return;
    }

    for (const remplStatusHook of this.remplStatusHooks) {
      remplStatusHook(window.__APOLLO_CLIENTS__);
    }
  }

  public toggleAutoRefreshEnabled() {
    this.isAutoRefreshEnabled = !this.isAutoRefreshEnabled;

    return this.isAutoRefreshEnabled;
  }

  private toggleStatus() {
    this.isRemplActive = !this.isRemplActive;

    if (this.isRemplActive) {
      rempl.getHost().activate();

      if (this.checkInterval) {
        clearInterval(this.checkInterval);
      }

      this.checkInterval = setInterval(() => {
        if (!this.isAutoRefreshEnabled) {
          return;
        }
        this.runAllHooks();
      }, 1500);

      return;
    }

    rempl.getHost().deactivate();
  }
}
