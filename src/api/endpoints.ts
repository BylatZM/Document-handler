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
    approve: 'user/approve',
    reject: 'user/reject/',
    detailsInfo: 'user/details/',
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
    create: '/possession/create',
    getNotApproved: '/possession/noApproved/all',
    approve: '/possession/approve/',
    reject: '/possession/reject/',
  },
  citizen: {
    create: '/citizen/new',
    get: '/citizen',
    update: '/citizen/update',
    delete: '/citizen/delete',
    approve: '/citizen/approve/',
    reject: '/citizen/reject/',
    getNotApproved: 'citizen/noApproved/all',
  },
  application: {
    create: 'application/new',
    updateComment: 'application/update',
    get: 'application/all',
    updateStatus: 'application/updateStatus',
  },
  employee: 'employee/get',
  grade: 'appClass/all',
  type: 'appType/all',
  subType: 'appSubtype/',
  status: 'appStatus/all',
  source: 'appSource/all',
  priority: 'appPriority/all',
};

export default endpoints;
