/**
 * Map of FeatureName > RouteName > RoutePath
 */
const RouteMap = {
  RootPath: '/',

  //* Login --------------------------------------------------------------------
  AuthPaths: {
    Login: '/login/:appid',
  },

  PrivatePaths: {
    Login: '/login',
  },

  //* Patient CRUD -------------------------------------------------------------
  PatientPaths: {
    PatientList: '/',
    PatientProfile: '/:id',
  },

  //* Practitioner CRUD --------------------------------------------------------
  PractitionerPaths: {
    PractitionerList: '/practitioner',
    PractitionerProfile: '/practitioner/:id',
  },

  //* Location CRUD ------------------------------------------------------------
  LocationPaths: {
    LocationList: '/location',
    LocationProfile: '/location/:id',
  },

  //* List CRUD ----------------------------------------------------------------
  ListPaths: {
    ListList: '/list',
    ListProfile: '/list/:id',
  },

  //* Education CRUD -----------------------------------------------------------
  EducationPaths: {
    EducationList: '/education',
    EducationCreate: '/education/new',
    EducationView: '/education/view/:id',
    EducationEdit: '/education/edit/:id',
  },

  //* Custom Inventory CRUD ----------------------------------------------------
  CustomInventoryPaths: {
    CustomInventoryList: '/custom-inventory',
    CustomInventoryCreate: '/custom-inventory/new',
    CustomInventoryView: '/custom-inventory/view/:id',
    CustomInventoryEdit: '/custom-inventory/edit/:id',
  },

  //* --------------------------------------------------------------------------
};

export default RouteMap;
