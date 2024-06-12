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
  phone: null,
  email: null,
  applicant_fio: '',
  type: null,
  subtype: null,
  complex: null,
  applicant_comment: '',
  dispatcher_comment: null,
  employee_comment: null,
  created_date: '',
  due_date: null,
  building_address: '',
  possession: null,
  normative: null,
};
