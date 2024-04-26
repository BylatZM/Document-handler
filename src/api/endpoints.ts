const endpoints = {
  login: 'login',
  refresh: 'refresh',
  help: 'help',
  user: {
    create: 'user/create',
    get: 'user',
    update: 'user/update',
    updatePassword: 'user/update/password',
  },
  complex: {
    getAll: 'complex/getAll',
    // getByComplexId: 'complex/',
  },
  building: {
    getAllByComplexId: 'building/getAll/',
    // getByBuildingId: 'building/',
  },
  possession: {
    getAllWithExtra: 'possession',
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
    updateSystemById: 'application/system/update/',
    updateSystemStatusById: 'application/system/update/status/',
    getAllSystemWithExtra: 'application/system/getAll',
    getAllGisWithExtra: 'application/gis/getAll',
    updateGisById: 'application/gis/update/',
    // updateGisStatusById: 'application/gis/update/status/',
    getAllStatuses: 'application/status/getAll',
    getAllTypes: 'application/type/getAll',
    getAllSubtypesByTypeId: 'application/subtype/getAll/',
    getAllSources: 'application/source/getAll',
    getAllPriorities: 'application/priority/getAll',
  },
  getEmploys: 'employee/getAll',
};

export default endpoints;
