import {UserModel} from './user.model';

export interface ProcessWorkgroupPermissionModel {
  id: string;
  level: ProcessWorkgroupLevelModel;
}

export interface ProcessWorkgroupModel extends ProcessWorkgroupPermissionModel {
  user?: UserModel;
}

export interface ProcessWorkgroupLevelModel {
  code: string;
  description: string;
}
