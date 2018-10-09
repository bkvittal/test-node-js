'use strict';

require('chai').should();
const expect = require('chai').expect;
const app = require('../src/server.js');
const request = require('supertest');
const nock = require('nock');
const config = require('../src/config');

let services;

if (config.services) {
  services = Object.keys(config.services).map(key => {
    let service = config.services[key];
    return {
      host: service.host,
      path:
        (service.paths ?
          service.paths[Object.keys(service.paths)[0]] :
          null)
    };
  });
}

describe('Health endpoint tests', () => {
  beforeEach(function beforeEach() { });

  afterEach(function afterEach() {
    nock.cleanAll();
  });

  describe('GET /health', () => {
    it('should respond to /health @health', (done) => {
      // if no services are configured, just pass the test
      if (!services) {
        done();
      }

      // mock the service calls
      for (let service of services) {
        if (service && service.host) {
          nock(service.host)
            .get(service.path)
            .reply(200, { Health: 'Good' });
        }
      }

      request(app)
        .get('/health')
        .set('accept', 'application/json')
        .expect(200)
        .end(() => {
          done();
        });
    });

    it('should return 500 if error exists @health', (done) => {
      /* uncomment this block if you have external services accessed via URL
         or provide custom test cases to ensure coverage
      // mock a service call to force an error
      let errorMsg = { Status: 'Error' };

      nock(services[0].host)
        .get(services[0].path)
        .replyWithError(errorMsg);

      request(app)
        .get('/health')
        .set('accept', 'application/json')
        .expect(500)
        .end((err, res) => {
          expect(res.body).to.have.property('status');
          expect(res.body.status).to.equal('Error');
          done();
        });
        */
      expect.fail(500, 500, 'Update this test if you have external services to ' +
        'connect to (via URL).');
      done();
    });

    it('should return 404 for invalid request path @health', (done) => {
      request(app)
        .get('/health1')
        .set('accept', 'application/json')
        .expect(404, done);
    });
  });

  ['OPTIONS', 'POST', 'PUT', 'DELETE'].forEach(method => {
    describe(`${method} /health`, () => {
      it('should return 405', (done) => {
        request(app)[method.toLowerCase()]('/health')
          .set('accept', 'application/json')
          .expect(405, done);
      });
    });
  });
});
