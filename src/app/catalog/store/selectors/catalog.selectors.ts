import {CatalogState} from '../states/catalog.state';
import {Selector} from '@ngxs/store';
import {CatalogStateModel} from '../models/catalog-state.model';

export class CatalogSelectors {
  @Selector([CatalogState])
  static recentFiles(state: CatalogStateModel): any {
    return state.recentFiles;
  }

  @Selector([CatalogState])
  static mainFolders(state: CatalogStateModel): any {
    return state.mainFolders;
  }
}
