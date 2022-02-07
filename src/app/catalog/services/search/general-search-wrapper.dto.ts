import {GeneralSearchItem} from './general-search-item';

export interface GeneralSearchWrapperDto {
  foundItems: GeneralSearchItem[];
  totalFoundItems: number;
}
