import {UserModel} from './user.model';
import {PermissionLevel} from './permission-level.enum';

export interface ProcessWorkgroupModel {
  id: string;
  level: ProcessWorkgroupLevelModel;
  user: UserModel;
}

export interface ProcessWorkgroupLevelModel {
  code: PermissionLevel | string;
  description: string;
}
