import { IEmailApplication } from '../../../../../types';

export const DefaultAppForm: IEmailApplication = {
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
  email: '',
  applicant_fio: '',
  type: null,
  subtype: null,
  applicant_comment: '',
  dispatcher_comment: null,
  employee_comment: null,
  created_date: '',
  due_date: null,
  possession: '',
  building_address: '',
  payment_code: '',
  complex: null,
  normative: null,
  employee_files: [],
};
