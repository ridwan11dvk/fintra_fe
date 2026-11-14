import type { ExternalUser, InternalUser } from "@railfinance/core/types";

// Response types are single-sourced from @railfinance/ui (InternalUser /
// ExternalUser / User). Local aliases below keep existing imports stable.
export type { ExternalUser, InternalUser, User } from "@railfinance/core/types";

export type InternalUserResponse = InternalUser;
export type ExternalUserResponse = ExternalUser;

// Internal User Types - ESA-based (NIPP lookup)

export interface InternalUserEsaCreateRequest {
  nipp: string;
  roles: number[];
}

export interface InternalUserEsaUpdateRequest {
  roles: number[];
}

export type InternalUserDirectCreateRequest = {
  nipp: string;
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
  companyCode: string;
  companyName: string;
  directorateCode?: string;
  directorateName?: string;
  directorateNomenclature?: string;
  personalAreaCode?: string;
  personalAreaName?: string;
  organizationCode?: string;
  organizationName?: string;
  organizationNomenclature?: string;
  jobCode?: string;
  jobName?: string;
  jobFamilyCode?: string;
  jobFamilyName?: string;
  subJobFamilyCode?: string;
  subJobFamilyName?: string;
  grade?: string;
  workerGroupCode?: string;
  workerGroupName?: string;
  subWorkerGroupCode?: string;
  subWorkerGroupName?: string;
  tempSupervisorNipp?: string;
  tempSupervisorName?: string;
  positionCode?: string;
  positionName?: string;
  positionNomenclature?: string;
  costCenterCode?: string;
  costCenterName?: string;
  corsaCode?: string;
  corsaName?: string;
  corsaNomenclature?: string;
  businessAreaCode?: string;
  businessAreaName?: string;
  supervisorLevelOneNipp?: string;
  supervisorLevelOneName?: string;
  supervisorLevelTwoNipp?: string;
  supervisorLevelTwoName?: string;
  supervisorLevelOnePosition?: string;
  supervisorLevelTwoPosition?: string;
  photo?: string;
  nik?: string;
  dateOfBirth?: string; // ISO date (YYYY-MM-DD)
  placeOfBirth?: string;
  employmentStartDate?: string; // ISO date (YYYY-MM-DD)
  mutationDate?: string; // ISO date (YYYY-MM-DD)
  genderCode?: string;
  genderName?: string;
  beginningDate?: string; // ISO date (YYYY-MM-DD)
  endingDate?: string; // ISO date (YYYY-MM-DD)
  recordingDate?: string; // ISO datetime (YYYY-MM-DDTHH:mm:ss)
  stat2?: string;
  psCode?: string;
  psText?: string;
  psGroup?: string;
  privyId?: string;
  roles: number[];
};

export type InternalUserDirectUpdateRequest = {
  nipp?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  companyCode?: string;
  companyName?: string;
  directorateCode?: string;
  directorateName?: string;
  directorateNomenclature?: string;
  personalAreaCode?: string;
  personalAreaName?: string;
  organizationCode?: string;
  organizationName?: string;
  organizationNomenclature?: string;
  jobCode?: string;
  jobName?: string;
  jobFamilyCode?: string;
  jobFamilyName?: string;
  subJobFamilyCode?: string;
  subJobFamilyName?: string;
  grade?: string;
  workerGroupCode?: string;
  workerGroupName?: string;
  subWorkerGroupCode?: string;
  subWorkerGroupName?: string;
  tempSupervisorNipp?: string;
  tempSupervisorName?: string;
  positionCode?: string;
  positionName?: string;
  positionNomenclature?: string;
  costCenterCode?: string;
  costCenterName?: string;
  corsaCode?: string;
  corsaName?: string;
  corsaNomenclature?: string;
  businessAreaCode?: string;
  businessAreaName?: string;
  supervisorLevelOneNipp?: string;
  supervisorLevelOneName?: string;
  supervisorLevelTwoNipp?: string;
  supervisorLevelTwoName?: string;
  supervisorLevelOnePosition?: string;
  supervisorLevelTwoPosition?: string;
  photo?: string;
  nik?: string;
  dateOfBirth?: string; // ISO date (YYYY-MM-DD)
  placeOfBirth?: string;
  employmentStartDate?: string; // ISO date (YYYY-MM-DD)
  mutationDate?: string; // ISO date (YYYY-MM-DD)
  genderCode?: string;
  genderName?: string;
  beginningDate?: string; // ISO date (YYYY-MM-DD)
  endingDate?: string; // ISO date (YYYY-MM-DD)
  recordingDate?: string; // ISO datetime (YYYY-MM-DDTHH:mm:ss)
  stat2?: string;
  psCode?: string;
  psText?: string;
  psGroup?: string;
  privyId?: string;
  roles?: number[];
};

export interface ExternalUserRequest {
  userType?: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  roles: number[];
  phoneNumber?: string;
  dateOfBirth?: string; // ISO date (YYYY-MM-DD)
  placeOfBirth?: string;
  photo?: string;
  nik?: string;
  npwp?: string;
  ktpFile?: string;
  npwpFile?: string;
  address?: string;
  companyCode?: string;
  companyName?: string;
  partnerCode?: string;
  businessAreaCode?: string;
  businessAreaName?: string;
  supervisorPositionCode?: string;
  supervisorPositionName?: string;
  responsibleName?: string;
  responsibleEmail?: string;
  responsibleNik?: string;
  responsibleAddress?: string;
  purpose?: string;
  startDate?: string;
  endDate?: string;
  privyId?: string;
  twoFactorEnabled?: boolean;
  otpSecret?: string;
}

// Admin Change Password Types
export interface AdminChangePasswordRequest {
  newPassword: string;
  confirmPassword: string;
}

// RKIP Date Limit Types
export interface RkipDateLimitRequest {
  dateLimit: string; // ISO 8601 date format (YYYY-MM-DD)
}

export interface BulkRKIPDateLimitRequest {
  roleIds: number[];
  dateLimit: string; // ISO 8601 date format (YYYY-MM-DD)
}
