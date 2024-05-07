import { IGisApplication } from '../../../../../types';

export const DefaultAppForm: IGisApplication = {
  id: 0,
  employee: null,
  status: {
    id: 1,
    name: 'Новая',
  },
  priority: {
    id: 0,
    name: '',
  },
  normative: null,
  phone: null,
  email: null,
  applicant_fio: '',
  type: '',
  applicant_сomment: '',
  dispatcher_comment: null,
  employee_comment: '',
  created_date: '',
  due_date: null,
  possession_address: '',
};
