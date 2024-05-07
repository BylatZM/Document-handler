import { TablePaginationConfig } from 'antd';

export interface IError {
  type: string;
  error: string;
}

export interface ICitizenError {
  error: IError;
  form_id: number;
}

export interface ICitizenLoading {
  form_id: number;
  isLoading: boolean;
}

export interface StoreState {
  AuthReducer: IAuthState;
  RegReducer: IRegState;
  HelpFormReducer: IHelpFormState;
  UserReducer: IUserState;
  CitizenReducer: ICitizenState;
  PossessionReducer: IPossessionState;
  ApplicationReducer: IApplicationState;
}

export interface IAuthState {
  user_id: number;
  access: string | null;
  error: IError | null;
  isLoading: boolean;
}

export type IPosLoading = 'complexes' | 'buildings' | 'possessions' | null;

export interface IHelpFormRequest {
  name: string;
  contact: string;
  title: string;
  description: string;
  address: string | undefined;
}

export interface IPossessionState {
  buildings: IBuilding[];
  complexes: IComplex[];
  possessions: IPossession[];
  isLoading: IPosLoading;
  error: IError | null;
}

export interface IUserState {
  user: IUser;
  isLoading: boolean;
  error: IError | null;
}

export type IAppLoading =
  | 'applications'
  | 'gisApplications'
  | 'types'
  | 'grades'
  | 'employs'
  | 'sources'
  | 'priorities'
  | 'statuses'
  | 'subtypes'
  | null;

export interface IApplicationState {
  applications: IApplication[];
  gisApplications: IGisApplication[];
  types: IType[];
  grades: IGrade[];
  employs: IEmployee[];
  sources: ISource[];
  priorities: IPriority[];
  statuses: IStatus[];
  subtypes: ISubtype[];
  isLoading: IAppLoading;
  error: IError | null;
}

export interface ICitizenState {
  citizenPossessions: ICitizenPossession[];
  isLoading: ICitizenLoading;
  error: ICitizenError | null;
}

export interface IHelpFormState {
  info: IHelpFormRequest;
  processedPossessions: string[] | null;
  isLoading: boolean;
  error: IError | null;
}

export interface IRegState {
  email: string;
  error: IError | null;
  isLoading: boolean;
}

export interface IAuthRequest {
  email: string;
  password: string;
}
export interface IAuthGoodResponse {
  user_id: number;
  access: string;
  refresh: string;
}

export interface IRefreshGoodResponse {
  access: string;
}

export interface IRegRequest {
  email: string;
}

export interface IUser {
  id: number;
  role: string;
  first_name: string;
  last_name: string;
  patronymic: null | string;
  phone: null | string;
  email: string;
  is_approved: boolean;
}

export type IUserUpdate = Omit<IUser, 'id' | 'role' | 'account_status' | 'email' | 'is_approved'>;

export interface IApplicationPagination {
  result: IApplication[];
  total: number;
}

export interface IGisApplicationPagination {
  result: IGisApplication[];
  total: number;
}

export interface IGisApplication {
  id: number;
  employee: IEmployee | null;
  status: IStatus;
  priority: IPriority;
  normative: INormative | null;
  phone: string | null;
  email: string | null;
  applicant_fio: string;
  type: string;
  applicant_сomment: string;
  dispatcher_comment: string | null;
  employee_comment: string;
  created_date: string;
  due_date: string | null;
  possession_address: string;
}

export type IGisTableColumns = Omit<
  IGisApplication,
  | 'id'
  | 'employee'
  | 'status'
  | 'priority'
  | 'normative'
  | 'phone'
  | 'email'
  | 'applicant_fio'
  | 'applicant_сomment'
  | 'dispatcher_comment'
  | 'employee_comment'
  | 'created_date'
  | 'due_date'
  | 'possession_address'
> & {
  key: number;
  createdDate: string;
  status: string;
  dueDate: string;
  applicantComment: string;
  possessionAddress: string;
  phone: string;
  email: string;
  employee: string;
  normative: number;
};

export interface INormative {
  normative_in_hours: number;
  company: string;
}

export interface IUpdateGisAppByDispatcher {
  status: number;
  dispatcher_comment: string | null;
  priority: number;
  employee: number | null;
}

export interface IUpdateGisAppByEmployee {
  status: number;
  employee_comment: string;
}

export interface IApplication {
  id: number;
  status: IStatus;
  type: IType;
  subtype: ISubtype;
  grade: IGrade;
  created_date: string;
  due_date: string | null;
  applicant_comment: string;
  priority: IPriority;
  source: ISource;
  complex: IComplex;
  building: IBuilding;
  possession: IPossession;
  employee: IEmployee | null;
  dispatcher_comment: string | null;
  employee_comment: string;
  applicant: {
    role: string;
  };
  possession_type: string;
  contact: string;
  applicant_fio: string;
}

export type IAppCreateByCitizen = Pick<
  IApplication,
  'applicant_comment' | 'contact' | 'applicant_fio'
> & {
  complex: number;
  building: number;
  possession: number;
  type: number;
  subtype: number;
};

export type IAppCreateByDispatcher = Pick<
  IApplication,
  'applicant_comment' | 'contact' | 'applicant_fio'
> & {
  complex: number;
  building: number;
  possession: number;
  employee: number | null;
  type: number;
  source: number;
  priority: number;
  dispatcher_comment?: string | null;
  subtype: number;
};

export type IAppUpdateByDispatcher = {
  type: number;
  subtype: number;
  source: number;
  priority: number;
  dispatcher_comment: string | null;
  employee: number | null;
  status: number;
};

export type IAppUpdateByEmployee = Pick<IApplication, 'employee_comment'> & {
  status: number;
};

export type IAppUpdateStatus = Pick<IApplication, 'status'>;

export interface IStatus {
  id: number;
  name: string;
}

export interface IType {
  id: number;
  name: string;
}

export interface ISubtype {
  id: number;
  type: string;
  name: string;
  normative_in_hours: number;
}

export interface IGrade {
  id: number;
  name: string;
}

export interface ISource {
  id: number;
  name: string;
}

export interface IEmployee {
  id: number;
  employee: string;
}

export interface IPriority {
  id: number;
  name: string;
}

export type IPossessionStatus = 'Отклонена' | 'На подтверждении' | 'Подтверждена';

export interface ICitizenPossession {
  id: number;
  possession_type: string;
  ownership_status: string;
  complex: IComplex;
  building: IBuilding;
  possession: IPossession;
  approving_status: IPossessionStatus;
  created_date: string;
}

export type IApprovePossession = Omit<
  ICitizenPossession,
  | 'id'
  | 'ownership_status'
  | 'complex'
  | 'building'
  | 'possession'
  | 'possession_type'
  | 'approving_status'
  | 'created_date'
> & {
  complex: number;
  type: number;
  building: number;
  name: string;
};

export type IApprovePossessionRequest = Omit<IApprovePossession, 'complex'>;

export type ICitizenRequest = Omit<
  ICitizenPossession,
  'id' | 'complex' | 'building' | 'possession' | 'approving_status' | 'created_date'
> & {
  complex: number;
  building: number;
  possession: number;
};

export interface IComplex {
  id: number;
  name: string;
}

export interface IPossession {
  id: number;
  name: string;
  building: string;
  type: 'квартира' | 'коммерческое помещение' | 'парковка' | 'кладовка' | 'жилищный комплекс' | '';
  personal_account: string | null;
}

export interface IBuilding {
  id: number;
  address: string;
  complex: string;
}

export interface INotApprovedPossession {
  id: number;
  type: string;
  building: string;
  approving_status: IPossessionStatus;
  who_created: null | string;
  personal_account: null | string;
  name: string;
  complex: string;
}

export interface INotApprovedCitizenPossession {
  id: number;
  first_name: string;
  last_name: string;
  patronymic: string | null;
  phone: string;
  email: string;
  complex: string;
  building: string;
  possession: string;
  approving_status: IPossessionStatus;
  ownership_status: string;
  possession_type: string;
  personal_account: string | null;
  created_date: string;
}

export interface ILivingSpaceColumns {
  key: number;
  status: IPossessionStatus;
  address: string;
}

export interface ICitizenPossessionsColumns {
  key: number;
  status: IPossessionStatus;
  address: string;
  citizenFIO: string;
}

export interface IApplicationCitizenColumns {
  key: number;
  createdDate: string;
  appType: string;
  appSubtype: string;
  status: string;
  dueDate: string;
  applicantComment: string;
  possession: string;
  building: string;
  complex: string;
  contact: string;
}

export interface IApplicationNotCitizenColumns {
  key: number;
  createdDate: string;
  appType: string;
  appSubtype: {
    name: string;
    normative: number;
  };
  status: string;
  dueDate: string;
  applicantComment: string;
  possession: string;
  building: string;
  complex: string;
  contact: string;
  employee: string;
  creator: string;
}

export interface IUpdatePassword {
  email: string;
  phone: string;
}

export interface IUpdateCitizenPossessionStatusByEmail {
  id: string | null;
  personal_account: string | null;
  operation: string | null;
}

export interface ITableParams {
  pagination?: TablePaginationConfig;
}

export type ISortingOption =
  | 'status_increasing'
  | 'status_decreasing'
  | 'creatingDate_increasing'
  | 'creatingDate_decreasing'
  | null;

export interface ISortOptions {
  status_inc: boolean;
  status_dec: boolean;
  creating_date_inc: boolean;
  creating_date_dec: boolean;
}

export interface ICache {
  subtype: ISubtypeCache[];
  type: ITypeCache[];
  source: ISourceCache[];
  priority: IPriorityCache[];
  status: IStatusCache[];
  building: IBuildingCache[];
}

export interface ISubtypeCache {
  url: string;
  data: ISubtype[];
}

export interface ITypeCache {
  url: string;
  data: IType[];
}

export interface IStatusCache {
  url: string;
  data: ISubtype[];
}

export interface IPriorityCache {
  url: string;
  data: ISubtype[];
}

export interface ISourceCache {
  url: string;
  data: ISubtype[];
}

export interface IBuildingCache {
  url: string;
  data: IBuilding[];
}
