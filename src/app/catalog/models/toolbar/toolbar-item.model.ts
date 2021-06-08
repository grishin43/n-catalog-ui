export interface ToolbarItemModel {
  id: string;
  i18name: string;
  subItems?: ToolbarItemModel[];
  delimiterAfter?: boolean;
  cb?: () => void;
}
