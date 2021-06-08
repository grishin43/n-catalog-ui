import {CatalogEntityEnum} from './catalog-entity.enum';
import {NpStatusPillEnum} from '../../shared/components/np-status-pill/models/np-status-pill.enum';
import {EmployeeModel} from '../../models/employee.model';

export interface CatalogEntityModel {
  id: string;
  name: string;
  icon?: string;
  type?: CatalogEntityEnum;
  root?: boolean;
  hasSubFolders?: boolean;
  subFolders?: CatalogEntityModel[];
  subFoldersCount?: number;
  filesCount?: number;
  participants?: EmployeeModel[];
  owner?: EmployeeModel;
  lastUpdated?: Date;
  status?: NpStatusPillEnum;
  editingBy?: EmployeeModel;
  link?: string;
}
