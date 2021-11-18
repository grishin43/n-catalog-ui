export interface UiNotification {
  correlationID: string;
  createdAt: string;
  notificationNumber: number
  notificationType: string;
  parameters: {
    processID:string;
  }
}
