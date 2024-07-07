import { IApplication } from '../../../../../types';

export const defaultAppForm: IApplication = {
  building: {
    id: 0,
    address: '',
    complex: '',
  },
  complex: {
    id: 0,
    name: '',
  },
  applicant_comment: '',
  created_date: '',
  applicant_fio: '',
  dispatcher_comment: '',
  due_date: null,
  employee: {
    id: 0,
    employee: '',
  },
  grade: {
    id: 1,
    name: '',
  },
  id: 0,
  subtype: {
    id: 0,
    type: '',
    name: '',
  },
  possession: {
    id: 0,
    name: '',
    type: '',
    building: '',
    personal_account: null,
  },
  priority: {
    id: 0,
    name: '',
  },
  source: {
    id: 0,
    name: '',
  },
  status: {
    id: 1,
    name: 'Новая',
  },
  type: {
    id: 0,
    name: '',
  },
  employee_comment: '',
  applicant: {
    role: '',
  },
  possession_type: '1',
  contact: '+7',
  normative: 0,
  citizen_files: [],
  employee_files: [],
};
