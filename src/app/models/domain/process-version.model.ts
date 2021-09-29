import {UserModel} from './user.model';

export interface ProcessVersionModel {
  id: string;
  name: string;
  desc?: string;
  user: UserModel;
  date: Date | string;
  launched?: boolean;
  active?: boolean;
}
