import {createSelector} from '@ngxs/store';
import {ProcessState} from './process.state';
import {ProcessModel} from '../../../models/domain/process.model';
import {MapHelper} from '../../helpers/map.helper';
import {CatalogEntityModel} from '../../models/catalog-entity.model';

export class ProcessSelectors {

  public static processesInFolder(folderId): (entities: ProcessModel[]) => CatalogEntityModel[] {
    return createSelector([ProcessState.entities], (entities: ProcessModel[]): CatalogEntityModel[] => {
      return entities.filter((process: ProcessModel) => {
        return process.parent.id === folderId;
      }).map(MapHelper.mapProcessToCatalogEntity);
    });
  }

}
