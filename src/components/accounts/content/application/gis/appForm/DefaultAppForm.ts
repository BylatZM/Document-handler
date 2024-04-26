import { IGisApplication } from '../../../../../types';

export const DefaultAppForm: IGisApplication = {
  id: 0,
  employee: null,
  status: {
    id: 1,
    appStatus: 'Новая',
  },
  priority: {
    id: 0,
    appPriority: '',
  },
  normative_in_hours: null,
  phone: null,
  email: null,
  applicant_fio: '',
  type: '',
  applicant_сomment: '',
  dispatcher_comment: null,
  employee_comment: '',
  creating_date: '',
  due_date: null,
  possession_address: '',
};
