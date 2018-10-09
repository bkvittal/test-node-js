'use strict';

require('chai').should();
const app = require('../src/server.js');
const request = require('supertest');
const config = require('../src/config');
// TODO: the v1 section shouldn't be hardcoded
const rootUrlForEndpoint = config.routes.controllerRootUrl + '/v1/testDemo';

describe('testDemo endpoint tests', () => {
  // create a section like this for each route you expose
  // list unsupported HTTP methods for the route
  ['OPTIONS', 'POST', 'PUT', 'DELETE'].forEach(method => {
    describe(`${method} ${rootUrlForEndpoint}`, () => {
      it('should return 405', (done) => {
        request(app)[method.toLowerCase()](`${rootUrlForEndpoint}`)
          .set('accept', 'application/json')
          .expect(405, done);
      });
    });
  });
});
