import {CatalogEntityEnum} from './catalog-entity.enum';
import {NpStatusPillEnum} from '../../shared/components/np-status-pill/models/np-status-pill.enum';
import {EmployeeModel} from '../../models/employee.model';

export interface CatalogEntityModel {
  id: string;
  name: string;
  type?: CatalogEntityEnum;
  hasSubFolders?: boolean;
  subFolders?: CatalogEntityModel[];
  participants: EmployeeModel[];
  owner: EmployeeModel;
  lastUpdated: Date;
  status: NpStatusPillEnum;
  editingBy?: EmployeeModel;
}
