// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // apiUrl: 'http://localhost:8080/britebin/api',
  apiUrl: 'http://localhost:8080/BriteBin/api',
  // apiUrl: '/britebin/webapi',

  // DEFINE USER ROLES CONSTANTS
  ROLE_ADMIN: 0,
  ROLE_DIST: 1,
  ROLE_SUB_DIST: 2,
  ROLE_CUST: 3,
  ROLE_DRIVER: 4,

  // DEFINE USER STATUS CONSTANTS
  STATUS_LOCKEDOUT: -1,  // INACTIVE
  STATUS_REGISTERED: 0,
  STATUS_ACTIVE: 1,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
