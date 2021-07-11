export const environment = {
  production: true,

  //apiUrl: 'https://www.britebin.com:9443/britebin-app-server/api',
  apiUrl: 'http://161.35.32.177:8080/BriteBin/api',
  // apiUrl: 'http:/localhost:8080/BriteBin/api',
  // apiUrl: 'http://10.253.40.99:8080/BriteBin/api',   // This version was required by Croatia

  // DEFINE USER ROLES CONSTANTS
  ROLE_ADMIN: 0,
  ROLE_DIST: 1,
  ROLE_SUB_DIST: 2,
  ROLE_CUST: 3,

  // DEFINE USER STATUS CONSTANTS
  STATUS_LOCKEDOUT: -1,
  STATUS_REGISTERED: 0,
  STATUS_ACTIVE: 1,
};
