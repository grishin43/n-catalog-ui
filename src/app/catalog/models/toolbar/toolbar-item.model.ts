export interface ToolbarItemModel {
  name: string;
  subItems?: ToolbarItemModel[];
  delimiterAfter?: boolean;
  cb?: () => void;
}
