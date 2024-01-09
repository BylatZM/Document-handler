const endpoints = {
  login: '/login',
  refresh: '/refresh',
  helpForm: '/helpForm',
  passwordUpdate: 'password/update',
  user: {
    create: '/user/new',
    get: '/user',
    update: '/user/update',
    getNotApproved: 'user/noApproved/all',
    approveUser: 'user/approve/',
  },
  complex: {
    getAll: '/complex/all',
    getCurrent: 'complex/current',
  },
  building: {
    getBy: '/building',
    getCurrent: '/building/current',
  },
  possession: {
    getBy: '/possession',
    getCurrent: '/possession/current',
    create: '/possession/create',
    getByComplexes: '/possession/byComplexes',
  },
  citizen: {
    create: '/citizen/new',
    get: '/citizen',
    update: '/citizen/update',
    delete: '/citizen/delete',
  },
  application: {
    create: 'application/new',
    update: 'application/update',
    get: 'application/all',
  },
  employee: 'employee/get',
  grade: 'appClass/all',
  type: 'appType/all',
  status: 'appStatus/all',
  source: 'appSource/all',
  priority: 'appPriority/all',
};

export default endpoints;
