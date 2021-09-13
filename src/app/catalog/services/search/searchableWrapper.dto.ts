import {SearchableItemDto} from './searchableItem.dto';

export interface SearchableWrapperDto {
  items: SearchableItemDto[];
  totalResults: number;
}
