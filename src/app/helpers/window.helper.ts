export class WindowHelper {

  public static enableBeforeUnload(): void {
    window.addEventListener('beforeunload', WindowHelper.beforeunloadHandler);
  }

  public static disableBeforeUnload(): void {
    window.removeEventListener('beforeunload', WindowHelper.beforeunloadHandler);
  }

  public static beforeunloadHandler = (e: BeforeUnloadEvent) => {
    const confirmationMessage = 'Are you sure?';
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
  };

}
