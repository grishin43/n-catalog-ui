export interface UserModel {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  profile: string;
  companyID: string;
  companyName: string;
  departmentName: string;
  positionName: string;
}

export interface WorkgroupUserModel {
  id: string;
  profile: string;
  fullName: string;
  avatar?: string;
  workplaces: WorkplaceModel[];
  department: CompanyDepartmentModel;
  chiefID: string;
}

export interface WorkplaceModel {
  position: UserPositionModel;
  username: string;
  email: string;
  company: CompanyModel;
}

export interface CompanyModel {
  companyID: string;
  companyName: string;
}

export interface CompanyDepartmentModel {
  departmentID: string;
  departmentName: string;
}

export interface UserPositionModel {
  positionID: string;
  positionName: string;
}
