import {SearchableWrapperDto} from './searchableWrapper.dto';

export interface SearchAutocompleteDto {
  folders: SearchableWrapperDto;
  processes: SearchableWrapperDto;
  recentSearches: SearchableWrapperDto;
}
