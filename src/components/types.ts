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

export interface IHelpFormRequest {
  name: string;
  email: string;
  title: string;
  description: string;
  address: string | undefined;
}

export interface IPossessionState {
  building: IBuilding[] | null;
  complex: IComplex[] | null;
  possession: IPossession[] | null;
  isLoading: IPosLoading;
}

export interface IUserState {
  user: IUser;
  notApproved: INotApproved[] | null;
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

export interface INotApproved {
  id: number;
  user: Omit<IUser, 'role' | 'isApproved'> & { id: number };
  status: string;
}

export interface IRefreshGoodResponse {
  access: string;
}

export interface IRegRequest {
  email: string;
}

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
  status: IStatus | null;
  priority: IPriority | null;
  type: IType;
  grade: IGrade | null;
  creatingDate: string | null;
  dueDate: string | null;
  citizenComment: string;
  source: ISource;
  complex: IComplex;
  building: IBuilding;
  possession: IPossession;
  employee: IEmployee | null;
  isAppeal: boolean;
  dispatcherComment: string | null;
  employeeComment: string | null;
  user: number;
  possessionType: string;
}

export type IAppCreateByCitizen = Pick<IApplication, 'citizenComment' | 'isAppeal'> & {
  complex: number;
  building: number;
  possession: number;
  type: number;
  source: number;
  status: number;
  grade: number;
};

export type IAppCreateByDispatcher = Pick<IApplication, 'dispatcherComment'> & {
  complex: number;
  building: number;
  possession: number;
  employee: number;
  type: number;
  source: number;
  status: number;
  grade: number;
  priority: number;
  dispatcherComment?: string | null;
};

export type IAppUpdateByDispatcher = {
  isAppeal: boolean;
  citizenComment: string;
  employee: number;
  status: number;
  type: number;
  source: number;
  priority: number;
  dispatcherComment?: string | null;
};

export type IAppUpdateByEmployee = Pick<IApplication, 'employeeComment'>;

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
  competence: ICompetence;
}

export interface ICompetence {
  id: number;
  competence: string;
}

export interface IPriority {
  id: number;
  appPriority: string;
}

export interface ICitizen {
  id: number;
  personal_account: string;
  possessionType: string;
  ownershipStatus: string;
  complex: IComplex;
  building: IBuilding;
  possession: IPossession;
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
> & {
  possession: Omit<IPossession, 'id'>;
  complex: number;
  type: number;
  building: number;
};

export type IApprovePossessionRequest = Omit<IApprovePossession, 'complex'>;

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
