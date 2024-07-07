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
  ApprovingReducer: IApprovingState;
}

export interface IAuthState {
  user_id: number;
  access: string | null;
  error: IError | null;
  isLoading: boolean;
}

export type IApprovingLoading = 'approvingCitizenPossessions' | 'approvingLivingSpaces' | null;

export interface IApprovingState {
  approvingCitizenPossessions: INotApprovedCitizenPossession[];
  approvingLivingSpaces: INotApprovedLivingSpace[];
  isLoading: IApprovingLoading;
  error: IError | null;
}

export interface IApprovingCitizenPossessionProcessingRow {
  row_id: number;
  operation: 'success' | 'loading';
  button_type: 'approve' | 'reject';
}

export type IPosLoading = 'complexes' | 'buildings' | 'possessions' | null;

export interface IPossessionState {
  possessionTypes: IPossessionType[];
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
  | 'emailApplications'
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
  emailApplications: IEmailApplication[];
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
  phone: string | null;
  email: string | null;
  applicant_fio: string;
  type: IType | null;
  subtype: ISubtype | null;
  complex: IComplex | null;
  applicant_comment: string;
  dispatcher_comment: string | null;
  employee_comment: string | null;
  created_date: string;
  due_date: string | null;
  building_address: string;
  possession: string | null;
  normative: number | null;
}

export interface IGisTableColumns {
  key: number;
  createdDate: string;
  status: string;
  type: string;
  subtype: string;
  dueDate: string;
  applicantComment: string;
  complex: string;
  building: string;
  possession: string;
  phone: string;
  email: string;
  fio: string;
  employee: string;
  normative: number;
}

export interface IUpdateGisAppByDispatcher {
  status: number;
  dispatcher_comment?: string | null;
  priority?: number;
  employee?: number;
  type?: number;
  subtype?: number;
  complex?: number;
}

export interface IUpdateGisAppByEmployee {
  status: number;
  employee_comment?: string | null;
}

export interface IEmailApplication {
  id: number;
  status: IStatus;
  type: IType | null;
  subtype: ISubtype | null;
  created_date: string;
  due_date: string | null;
  applicant_comment: string;
  priority: IPriority;
  complex: IComplex | null;
  building_address: string;
  possession: string;
  employee: IEmployee | null;
  dispatcher_comment: string | null;
  employee_comment: string | null;
  applicant_fio: string;
  email: string;
  phone: string | null;
  payment_code: string;
  normative: number | null;
  employee_files: IFile[];
}

export interface IEmailTableColumns {
  key: number;
  createdDate: string;
  status: string;
  type: string;
  subtype: string;
  dueDate: string;
  applicantComment: string;
  complex: string;
  building: string;
  possession: string;
  phone: string;
  email: string;
  fio: string;
  employee: string;
  payment_code: string;
  normative: number;
}

export interface IUpdateEmailAppByDispatcher {
  type?: number;
  subtype?: number;
  priority?: number;
  dispatcher_comment?: string | null;
  complex?: number;
  employee?: number | null;
  status: number;
}

export interface IUpdateEmailAppByEmployee {
  status: number;
  employee_comment?: null | string;
}

export interface IEmailApplicationPagination {
  result: IEmailApplication[];
  total: number;
}

export interface IFile {
  url: string;
  name: string;
  created_date: string;
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
  employee_comment: string | null;
  applicant: {
    role: string;
  };
  possession_type: string;
  contact: string;
  applicant_fio: string;
  normative: number | null;
  citizen_files: IFile[];
  employee_files: IFile[];
}

export interface IAddingFile {
  url: string;
  file: File;
}

export interface IAppCreateByCitizen {
  complex: number;
  building: number;
  possession: number;
  type: number;
  subtype: number;
  applicant_comment: string;
  contact: string;
  applicant_fio: string;
}

export interface IAppCreateByDispatcher {
  complex: number;
  building: number;
  possession: number;
  applicant_comment: string;
  contact: string;
  applicant_fio: string;
  employee: number | null;
  type: number;
  source: number;
  priority: number;
  dispatcher_comment?: string | null;
  subtype: number;
}

export interface ICreateApplicationByCitizenSuccessResponse {
  application_id: number;
}

export type IAppUpdateByDispatcher = {
  type?: number;
  subtype?: number;
  source?: number;
  priority?: number;
  dispatcher_comment?: string | null;
  employee?: number | null;
  status: number;
};

export interface IAppUpdateByEmployee {
  employee_comment?: string | null;
  status: number;
}

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

export interface IPossessionType {
  id: number;
  name: string;
}

export interface INotApprovedLivingSpace {
  id: number;
  type: 'квартира' | 'коммерческое помещение' | 'парковка' | 'кладовка';
  building: string;
  approving_status: IPossessionStatus;
  who_created: null | string;
  personal_account: null | string;
  name: string;
  complex: string;
}

export interface INotApprovedLivingSpacePagination {
  result: INotApprovedLivingSpace[];
  total: number;
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

export interface INotApprovedCitizenPossessionPagination {
  result: INotApprovedCitizenPossession[];
  total: number;
}

export interface IFilterNotApprovedCitizenPossessionOptions {
  complexId: number | null;
  buildingId: number | null;
  possessionName: string | null;
  possessionType: number | null;
  statusId: number | null;
  fio: string | null;
}

export interface ISortNotApprovedCitizenPossessionOptions {
  creating_date_inc: boolean;
  creating_date_dec: boolean;
}

export type IFilterNotApprovedLivingSpacesOptions = Omit<
  IFilterNotApprovedCitizenPossessionOptions,
  'fio'
> & {
  creator: string | null;
  personalAccount: string | null;
};

export interface ILivingSpaceColumns {
  key: number;
  approving_status: IPossessionStatus;
  complex: string;
  building: string;
  whoCreated: string;
  personalAccount: string;
  possessionType: 'квартира' | 'коммерческое помещение' | 'парковка' | 'кладовка';
  possessionName: string;
}

export interface ICitizenPossessionsColumns {
  key: number;
  status: IPossessionStatus;
  possessionName: string;
  possessionType: string;
  complex: string;
  building: string;
  createdDate: string;
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
  appSubtype: string;
  status: string;
  dueDate: string;
  applicantComment: string;
  possessionType: string;
  possessionNumber: string;
  building: string;
  complex: string;
  contact: string;
  employee: string;
  creator: string;
  fio: string;
  phone: string;
  normative: number;
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

export interface IFilterAppOptions {
  complexId: number | null;
  buildingId: number | null;
  statusId: number | null;
  role: 'dispatcher' | 'citizen' | null;
  phone: string | null;
  fio: string | null;
  possessionType: number | null;
  possessionName: string | null;
  typeId: number | null;
  subtypeName: string | null;
}

export interface IFilterEmailAppOptions {
  complexId: number | null;
  buildingAddress: string | null;
  statusId: number | null;
  phone: string | null;
  email: string | null;
  fio: string | null;
  possessionName: string | null;
  typeId: number | null;
  subtypeName: string | null;
}

export interface IFilterGisAppOptions {
  complexId: number | null;
  buildingAddress: string | null;
  statusId: number | null;
  phone: string | null;
  email: string | null;
  fio: string | null;
  possessionName: string | null;
  typeId: number | null;
  subtypeName: string | null;
}

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

export interface IAccordionState {
  directories: boolean;
  confirmations: boolean;
}

export interface IAboutMeGeneralSteps {
  first_name: boolean;
  last_name: boolean;
  phone: boolean;
  general_button: boolean;
  edit_form_button: boolean;
}

export interface IAboutMeFormSteps {
  complex: boolean;
  building: boolean;
  possession: boolean;
  create_button: boolean;
}
