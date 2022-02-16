import {SearchableItemDto} from './searchableItem.dto';

export interface SearchableWrapperDto {
  items: SearchableItemDto[] | {value: string}[];
  totalResults: number;
}
