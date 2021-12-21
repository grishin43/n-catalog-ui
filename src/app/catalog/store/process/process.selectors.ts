import {createSelector, Selector} from '@ngxs/store';
import {ProcessState} from './process.state';
import {ProcessModel} from '../../../models/domain/process.model';
import {MapHelper} from '../../helpers/map.helper';
import {CatalogEntityModel} from '../../models/catalog-entity.model';

export class ProcessSelectors {
  static processesInFolder(folderId) {
    return createSelector([ProcessState.entities], (entities: ProcessModel[]): CatalogEntityModel[] => {
        return entities.filter((process: ProcessModel) => {
          return process.parent.id === folderId;
        }).map(MapHelper.mapProcessToCatalogEntity);
    })
  }
}
