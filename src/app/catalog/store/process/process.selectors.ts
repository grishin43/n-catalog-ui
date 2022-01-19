import {createSelector} from '@ngxs/store';
import {ProcessState} from './process.state';
import {ProcessModel} from '../../../models/domain/process.model';
import {MapHelper} from '../../helpers/map.helper';
import {CatalogEntityModel} from '../../models/catalog-entity.model';
import {ProcessSelectorsHelper} from './process-selectors.helper';

export class ProcessSelectors {

  public static processesInFolder(folderId): (entities: ProcessModel[]) => CatalogEntityModel[] {
    return createSelector([ProcessState.entities], (entities: ProcessModel[]): CatalogEntityModel[] => {
      return ProcessSelectorsHelper
            .filterProcessByFolderId(entities, folderId)
            .map(MapHelper.mapProcessToCatalogEntity);
    });
  }

}
