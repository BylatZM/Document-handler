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
  citizen: {
    possession: {
      create: 'citizen/possession/create',
      getAll: 'citizen/possession/getAll',
      updateByCitizenPossessionId: 'citizen/possession/update/',
      updateStatusWithExtraBySystem: 'citizen/possession/update/status/by_system',
      updateStatusByEmail: 'citizen/possession/update/status/by_email',
      deleteByCitizenPossessionId: 'citizen/possession/delete/',
      getAllNotApproved: 'citizen/possession/not_approved/getAll',
    },
    mark: 'citizen/mark/add',
    fioWithExtra: 'citizen/fio/getAll',
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
  openKazan: {
    getAllApplicationWithExtra: 'application/open_kazan/getAll',
    updateByDispatcherSetCloseStatusById: 'application/open_kazan/dispatcher/update/status/close/',
    updateByEmployeeSetInWorkStatusById: 'application/open_kazan/employee/update/status/work/',
    updateByEmployeeSetCloseStatusById: 'application/open_kazan/employee/update/status/close/'
  },
  employee: {
    getEmploysWithExtra: 'employee/getAll',
  },
  video: {
    getAllByBuildingId: 'video/get/',
  },
};

export default endpoints;
