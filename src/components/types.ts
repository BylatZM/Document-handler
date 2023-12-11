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

export type IPosLoading = 'complex' | 'building' | 'possession' | null;

export interface IPossessionState {
  building: IBuilding[] | null;
  complex: IComplex[] | null;
  possession: IPossession[] | null;
  isLoading: IPosLoading;
}

export interface IUserState {
  user: IUser;
  isLoading: boolean;
  error: IError | null;
}

export interface IApplicationState {
  userApplication: IApplication[];
  types: IType[] | null;
  grades: IGrade[] | null;
  employs: IEmployee[] | null;
  sources: ISource[] | null;
  priorities: IPriority[] | null;
  statuses: IStatus[] | null;
  isLoading: boolean;
  error: IError | null;
}

export interface ICitizenState {
  citizen: ICitizen[];
  isLoading: ICitizenLoading | null;
  error: ICitizenError | null;
}

export interface IHelpFormState {
  userName: string;
  email: string;
  title: string;
  reason: string;
  address: string | null;
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

export type IHelpFormRequest = Omit<IHelpFormState, 'error' | 'isLoading'>;

export interface IUser {
  role: IRole;
  first_name: string;
  last_name: string;
  patronymic: null | string;
  phone: null | string;
  email: string;
  isApproved: boolean;
}

export type IUserUpdate = Omit<IUser, 'role' | 'isApproved' | 'email'>;

export interface IApplication {
  id: number;
  status?: number | null;
  priority?: number | null;
  type?: number;
  grade?: number | null;
  creatingDate?: string | null;
  dueDate?: string | null;
  citizenComment?: string;
  source?: number;
  complex: IComplex;
  building: IBuilding;
  possession: IPossession;
  employee?: IEmployee | null;
  isAppeal?: boolean;
  dispatcherComment?: string | null;
  employeeComment?: string | null;
  user: number;
}

export type IApplicationRequest = Omit<
  IApplication,
  'complex' | 'building' | 'possession' | 'id' | 'employee' | 'user'
> & {
  complex?: number;
  building?: number;
  possession?: number;
  employee?: number;
};

export interface IStatus {
  id: number;
  appStatus: string;
}

export interface IType {
  id: number;
  appType: string;
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
  user: Pick<IUser, 'first_name' | 'last_name' | 'patronymic'>;
}

export interface IPriority {
  id: number;
  appPriority: string;
}

export interface ICitizen {
  id: number;
  personal_account: string;
  ownershipType: string;
  ownershipStatus: string;
  complex: IComplex;
  building: IBuilding;
  possession: IPossession;
}

export type ICitizenRequest = Omit<ICitizen, 'id' | 'complex' | 'building' | 'possession'> & {
  complex: number;
  building: number;
  possession: number;
};

export interface IRole {
  role: string;
}

export interface IComplex {
  id: number;
  name: string;
}

export interface ICar {
  car_brand: string;
  car_model: string | null;
  state_number: string | null;
}

export interface IPossession {
  id: number;
  address: string;
  car: ICar | null;
}

export type IBuilding = Omit<IPossession, 'car'>;
