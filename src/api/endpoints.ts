const endpoints = {
  login: 'login',
  refresh: 'refresh',
  help: 'help',
  user: {
    create: 'user/create',
    get: 'user/get',
    update: 'user/update',
    updatePassword: 'user/update/password',
  },
  complex: {
    getAll: 'complex/getAll',
  },
  building: {
    getAllByComplexId: 'building/getAll/',
    getAll: 'building/getAll',
  },
  possession: {
    getAllWithExtra: 'possession/getAll',
    create: 'possession/create',
    getAllNotApproved: 'possession/not_approved/getAll',
    updateStatusWithExtra: 'possession/update/status',
  },
  citizenPossession: {
    create: 'citizen_possession/create',
    getAll: 'citizen_possession/getAll',
    updateByCitizenPossessionId: 'citizen_possession/update/',
    updateStatusWithExtraBySystem: 'citizen_possession/update/status/by_system',
    updateStatusByEmail: 'citizen_possession/update/status/by_email',
    deleteByCitizenPossessionId: 'citizen_possession/delete/',
    getAllNotApproved: 'citizen_possession/not_approved/getAll',
  },
  application: {
    createSystem: 'application/system/create',
    loadSysFiles: 'application/system/create/file',
    updateSystemById: 'application/system/update/',
    updateSystemStatusById: 'application/system/update/status/',
    getAllSystemWithExtra: 'application/system/getAll',
    getAllGisWithExtra: 'application/gis/getAll',
    updateGisById: 'application/gis/update/',
    loadEmailFiles: 'application/email/create/file',
    getAllEmailAppWithExtra: 'application/email/getAll',
    updateEmailAppById: 'application/email/update/',
    getAllStatuses: 'application/status/getAll',
    getAllTypesByComplexId: 'application/type/getAll/',
    getAllTypes: 'application/type/getAll',
    getAllSubtypesWithExtra: 'application/subtype/getAll',
    getAllSources: 'application/source/getAll',
    getAllPriorities: 'application/priority/getAll',
  },
  employee: {
    getEmploysWithExtra: 'employee/getAll',
  },
};

export default endpoints;
