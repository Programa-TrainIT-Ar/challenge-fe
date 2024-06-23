// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  auth0: {
    domain: 'dev-57mb2czg3obaii4q.us.auth0.com',
    clientId: 'fSXB15CjWcHa1mcW0cCgG0nG9ska0Qx0',
    authorizationParams: {
      audience: 'https://pct-api.demo.com',
      redirect_uri: 'http://localhost:4200/',
    },
    // errorPath: '/callback',
  },
  api: {
    serverUrl: 'http://localhost:8000',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
