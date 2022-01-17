export interface UiNotification {
  correlationID: string;
  createdAt: string;
  notificationNumber: number;
  notificationType: string;
  parameters: {
    processID: string;
    resourceID?: string;
    generation?: number;
    parentProcessGeneration?: number;
    versionTitle?: string;
    versionDescription?: string;
  };
}
