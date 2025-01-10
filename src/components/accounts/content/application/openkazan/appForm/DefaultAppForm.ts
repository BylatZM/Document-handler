import { IOpenKazanApplication } from '../../../../../types';

export const DefaultAppForm: IOpenKazanApplication = {
  id: 0,
  status: {
    id: 1,
    name: 'Новая',
  },
  building_address: '',
  possession: '',
  applicant_comment: '',
  created_date: '',
  due_date: '',
  deadline: '',
  employee_name: null,
  applicant_fio: '',
  contact: '',
  is_emergency: false,
  type_name: '',
  subtype_name: ''
};
