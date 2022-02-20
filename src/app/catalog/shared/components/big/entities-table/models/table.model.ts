import {TableDataTypeEnum} from './table-data-type.enum';

export interface TableColumnsModel {
  width?: string;
  text: string; // TH inner text
  name?: string; // key related field name
  type: TableDataTypeEnum;
}
