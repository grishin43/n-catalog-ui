import {CompanyModel} from './company.model';

export interface UserModel {
  username: string;
  email: string;
  firstName: string;
  middleName: string;
  lastName: string;
  company?: string;
  companies?: CompanyModel[];
  subDivision?: string;
  position?: string;
  url?: string;
  avatar?: string;
}
