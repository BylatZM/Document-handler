import { IOpenKazanApplication } from '../../../../../types';

export const DefaultAppForm: IOpenKazanApplication = {
  id: 0,
  status: {
    id: 1,
    name: 'Назначена',
  },
  complex: null,
  building_address: '',
  possession: '',
  applicant_comment: '',
  dispatcher_comment: '',
  employee_comment: '',
  created_date: '',
  due_date: '',
  deadline: '',
  employee: {
    id: 1,
    employee: ''
  },
  applicant_fio: '',
  contact: '',
  is_emergency: false,
  type_name: '',
  subtype_name: '',
  is_expired: false,
  is_warning: false
};
