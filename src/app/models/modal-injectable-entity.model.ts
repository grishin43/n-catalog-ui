import {CatalogEntityEnum} from '../catalog/models/catalog-entity.enum';
import {FolderModel} from './domain/folder.model';
import {CurrentProcessModel} from '../catalog/models/current-process.model';
import {BehaviorSubject} from 'rxjs';

export interface ModalInjectableEntityModel {
  entity?: FolderModel |  CurrentProcessModel;
  parent?: FolderModel;
  type?: CatalogEntityEnum;
  ssCb?: (str?: string) => void;
  asyncLoader?: BehaviorSubject<string>;
  openCreatedInstance?: boolean;
}
