import { IApplication } from '../../../../../types';

export const defaultAppForm: IApplication = {
  building: {
    id: 0,
    building: '',
  },
  complex: {
    id: 0,
    name: '',
  },
  citizenFio: '',
  creatingDate: '',
  citizenComment: '',
  dispatcherComment: '',
  dueDate: null,
  employee: {
    id: 0,
    employee: '',
    competence: '',
    company: '',
  },
  grade: {
    id: 1,
    appClass: '',
  },
  id: 0,
  subtype: {
    id: 0,
    type: '',
    subtype: '',
    normative: 0,
  },
  possession: {
    id: 0,
    address: '',
    type: '',
    building: '',
  },
  priority: {
    id: 0,
    appPriority: '',
  },
  source: {
    id: 0,
    appSource: '',
  },
  status: {
    id: 1,
    appStatus: 'Новая',
  },
  type: {
    id: 0,
    appType: '',
  },
  employeeComment: '',
  user: {
    role: '',
  },
  possessionType: '1',
  contact: '+7',
};
