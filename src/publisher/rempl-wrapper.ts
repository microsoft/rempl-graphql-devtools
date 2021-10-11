import rempl from "rempl";
import hotkeys from "hotkeys-js";

type RemplStatusHook = () => void;

export class RemplWrapper {
  private static _instance: RemplWrapper | null;
  private isRemplActive = false;
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

  private toggleStatus() {
    this.isRemplActive = !this.isRemplActive;

    if (this.isRemplActive) {
      rempl.getHost().activate();

      if (this.checkInterval) {
        clearInterval(this.checkInterval);
      }

      this.checkInterval = setInterval(() => {
        for (const remplStatusHook of this.remplStatusHooks) {
          remplStatusHook();
        }
      }, 1000);

      return;
    }

    rempl.getHost().deactivate();
  }
}
