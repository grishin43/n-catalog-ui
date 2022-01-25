import {CatalogEntityEnum} from './catalog-entity.enum';
import {NpStatusPillEnum} from '../../shared/components/small/np-status-pill/models/np-status-pill.enum';
import {EmployeeModel} from '../../models/employee.model';
import {CatalogEntityPermissionEnum} from './catalog-entity-permission.enum';

export interface CatalogEntityModel {
  id: string; // is used
  name: string; // is used
  icon?: string; // is used
  type?: CatalogEntityEnum; // is used
  root?: boolean; // is used
  hasSubFolders?: boolean; // is used
  hasProcesses?: boolean; // is used
  subFoldersCount?: number; // isn't used. to be deprecated and moved to new compatible model
  processesCount?: number; // isn't used. to be deprecated and moved to new compatible model
  entities?: CatalogEntityModel[]; // isn't used. to be deprecated and moved to new compatible model
  participants?: EmployeeModel[]; // isn't used. to be deprecated and moved to new compatible model
  owner?: EmployeeModel; // isn't used. to be deprecated and moved to new compatible model
  lastUpdated?: Date; // isn't used. to be deprecated and moved to new compatible model
  status?: NpStatusPillEnum; // is used // to add status for future delete
  editingBy?: EmployeeModel; // isn't used. to be deprecated and moved to new compatible model
  link?: string; // is used for process
  permissions?: CatalogEntityPermissionEnum; // is used
  path?: string; // isn't used. to be deprecated and moved to new compatible model
  original?: any; // wrapper for backend item
  toBeDeleted?: boolean;
}
