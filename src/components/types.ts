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

export type IPosLoading = 'complex' | 'building' | 'possession' | 'notApproved' | null;

export interface IHelpFormRequest {
  name: string;
  contact: string;
  title: string;
  description: string;
  address: string | undefined;
}

export interface IPossessionState {
  buildings: IBuildingWithComplex[];
  complexes: IComplex[];
  possessions: IPossession[];
  isLoading: IPosLoading;
}

export interface IUserState {
  user: IUser;
  isLoading: boolean;
  error: IError | null;
}

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
  isLoading: boolean;
  error: IError | null;
}

export interface ICitizenState {
  citizen: ICitizen[];
  isLoading: ICitizenLoading;
  error: ICitizenError | null;
}

export interface IHelpFormState {
  info: IHelpFormRequest;
  processed_possessions: string[] | null;
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

export type IUserAccountStatus = 'На подтверждении' | 'Подтвержден' | 'Отклонен';

export interface IUser {
  id: number;
  role: IRole;
  first_name: string;
  last_name: string;
  patronymic: null | string;
  phone: null | string;
  email: string;
  account_status: IUserAccountStatus;
}

export interface IUserDetailsInfo {
  first_name: string;
  last_name: string;
  email: string;
  patronymic: string | null;
  phone: string;
  possessions: ICitizen[];
}

export type IUserUpdate = Omit<IUser, 'id' | 'role' | 'account_status' | 'email'>;

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
  normative_in_hours: INormative | null;
  phone: string | null;
  email: string | null;
  applicant_fio: string;
  type: string;
  applicant_сomment: string;
  dispatcher_comment: string | null;
  employee_comment: string | null;
  creating_date: string;
  due_date: string | null;
  possession_address: string;
}

export type IGisTableColumns = Omit<
  IGisApplication,
  | 'employee'
  | 'status'
  | 'priority'
  | 'normative_in_hours'
  | 'dispatcher_comment'
  | 'phone'
  | 'email'
  | 'due_date'
  | 'employee_comment'
  | 'id'
> & {
  employee: string;
  status: string;
  phone: string;
  email: string;
  due_date: string;
  normative_in_hours: number;
  key: number;
};

export interface INormative {
  normative_in_hours: number;
  management_company: string;
}

export interface IUpdateGisAppByDispatcher {
  status: number;
  dispatcher_comment: string | null;
  priority: number;
  employee: number;
}

export interface IUpdateGisAppByEmployee {
  status: number;
  employee_comment: string | null;
}

export interface IApplication {
  id: number;
  status: IStatus;
  type: IType | null;
  subtype: ISubtype | null;
  grade: IGrade;
  creatingDate: string;
  dueDate: string | null;
  citizenComment: string;
  priority: IPriority;
  source: ISource;
  complex: IComplex;
  building: IBuilding;
  possession: IPossession;
  employee: IEmployee;
  dispatcherComment: string;
  employeeComment: string;
  user: {
    role: string;
  };
  possessionType: string;
  contact: string;
  citizenFio: string;
}

export type IAppCreateByCitizen = Pick<
  IApplication,
  'citizenComment' | 'contact' | 'citizenFio'
> & {
  complex: number;
  building: number;
  possession: number;
  type: number;
  subtype: number;
};

export type IAppCreateByDispatcher = Pick<
  IApplication,
  'citizenComment' | 'contact' | 'citizenFio'
> & {
  complex: number;
  building: number;
  possession: number;
  employee: number;
  type: number;
  source: number;
  priority: number;
  dispatcherComment?: string;
  subtype: number;
};

export type IAppUpdateByDispatcher = {
  type: number;
  subtype: number;
  source: number;
  priority: number;
  dispatcherComment: string;
  employee: number;
};

export type IAppUpdateByEmployee = Pick<IApplication, 'employeeComment'>;

export type IAppUpdateStatus = Pick<IApplication, 'status'>;

export interface IStatus {
  id: number;
  appStatus: string;
}

export interface IType {
  id: number;
  appType: string;
}

export interface ISubtype {
  id: number;
  type: string;
  subtype: string;
  normative: number;
}

export interface IGrade {
  id: number;
  appClass: string;
}

export interface ISource {
  id: number;
  appSource: string;
}

export interface IEmployee {
  id: number;
  employee: string;
  competence: string;
  company: string;
}

export interface ICompetence {
  id: number;
  competence: string;
}

export interface IPriority {
  id: number;
  appPriority: string;
}

export type IPossessionStatus = 'Отклонена' | 'На подтверждении' | 'Подтверждена';

export interface ICitizen {
  id: number;
  personal_account: string;
  possessionType: string;
  ownershipStatus: string;
  complex: IComplex;
  building: IBuilding;
  possession: IPossession;
  approving_status: IPossessionStatus;
}

export type IApprovePossession = Omit<
  ICitizen,
  | 'id'
  | 'personal_account'
  | 'ownershipStatus'
  | 'complex'
  | 'building'
  | 'possession'
  | 'possessionType'
  | 'approving_status'
> & {
  complex: number;
  type: number;
  building: number;
  possession: string;
};

export type IApprovePossessionRequest = Omit<IApprovePossession, 'complex'>;

export type ICitizenRequest = Omit<
  ICitizen,
  'id' | 'complex' | 'building' | 'possession' | 'approving_status'
> & {
  complex: number;
  building: number;
  possession: number;
};

export type IRole = 'executor' | 'dispatcher' | 'citizen' | string;

export interface IComplex {
  id: number;
  name: string;
}

export interface ICar {
  car_brand: string;
  car_model: string | null;
  state_number: string | null;
}

export interface IBuildingWithComplex {
  id: number;
  building: string;
  complex: string;
}

export interface IPossession {
  id: number;
  address: string;
  building: string;
  type: 'квартира' | 'коммерческое помещение' | 'парковка' | 'кладовка' | 'жилищный комплекс' | '';
}

export interface IBuilding {
  id: number;
  building: string;
}

export interface INotApprovedUsers {
  id: number;
  first_name: string;
  last_name: string;
  account_status: IUserAccountStatus;
}

export interface INotApprovedPossessions {
  id: number;
  type: string;
  building: string;
  approving_status: IPossessionStatus;
  address: string;
}

export interface INotApprovedCitizens {
  id: number;
  fio: string;
  phone: string;
  email: string;
  complex: string;
  building: string;
  possession: string;
  approving_status: string;
  ownershipStatus: string;
  possessionType: string;
  personal_account: string;
}

export interface IApplicationCitizenColumns {
  key: number;
  creating_date: string;
  app_type: string;
  app_subtype: string;
  status: string;
  due_date: string;
  citizen_comment: string;
  possession: string;
  building: string;
  complex: string;
  contact: string;
}

export interface IApplicationNotCitizenColumns {
  key: number;
  creating_date: string;
  app_type: string;
  app_subtype: {
    name: string;
    normative: number;
  };
  status: string;
  due_date: string;
  citizen_comment: string;
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

export interface IApproveUserByLink {
  id: string | null;
  key: string | null;
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
}

export interface ISubtypeCache {
  url: string;
  data: ISubtype[];
}

export interface ITypeCache {
  url: string;
  data: ISubtype[];
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
