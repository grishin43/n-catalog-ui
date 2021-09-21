import {CatalogEntityEnum} from '../catalog/models/catalog-entity.enum';
import {FolderModel} from './domain/folder.model';
import {ProcessModel} from './domain/process.model';
import {BehaviorSubject} from 'rxjs';

export interface ModalInjectableDataModel {
  entity?: FolderModel | ProcessModel;
  parent?: FolderModel;
  type?: CatalogEntityEnum;
  ssCb?: (str?: string) => void;
  asyncLoader?: BehaviorSubject<string>;
}
