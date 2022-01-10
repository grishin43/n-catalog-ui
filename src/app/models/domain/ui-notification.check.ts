export interface UiNotificationCheck {
  correlationId: string;
  isChecked: boolean;
  parameters?: {
    processID: string;
    generation?: number;
  };
}
