import {CatalogState} from '../states/catalog.state';
import {Selector} from '@ngxs/store';
import {CatalogStateModel} from '../models/catalog-state.model';

export class CatalogSelectors {
  @Selector([CatalogState])
  static recentProcesses(state: CatalogStateModel): any {
    return state.recentProcesses;
  }

  @Selector([CatalogState])
  static mainFolders(state: CatalogStateModel): any {
    return state.mainFolders;
  }
}
