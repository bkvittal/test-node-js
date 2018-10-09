'use strict';

const config = require('../src/config');
const { override } = require('../src/lib/objectHelpers');
const should = require('chai').should();
const app = require('../src/server');
const request = require('supertest');

function getComponentByName(components, name) {
  return components.find((component) => {
    return component.name === name;
  });
}

describe('Config endpoint tests', () => {
  describe('GET /cfg', () => {
    it('should respond to /cfg @cfg', (done) => {
      request(app)
        .get('/cfg')
        .set('accept', 'application/json')
        .expect(200)
        .end(done);
    });
    ['dev', 'qa', 'production'].forEach((environment) => {
      it(`should return 200 and ${environment} configuration on success @cfg`, function test() {
        // if no services are configured, just pass the test
        if (!config.services) {
          return {};
        }
        process.env.NODE_ENV = environment;

        return request(app)
          .get('/cfg')
          .set('accept', 'application/json')
          .expect(200)
          .expect((res) => {
            // assert service
            res.body.status.should.equal('Ok');

            let servicesFromResponse = getComponentByName(res.body.components, 'services');

            Object.keys(config.services).forEach(configServiceName => {
              let matchingServiceFromResponse =
                getComponentByName(servicesFromResponse.components, configServiceName);

              should.exist(matchingServiceFromResponse,
                `Service ${configServiceName} should return configuration.`);
            });
          });
      });
    });
    it('should return 404 for invalid request path @cfg', function test(done) {
      request(app)
        .get('/cfg1')
        .set('accept', 'application/json')
        .expect(404, done);
    });
  });
  ['OPTIONS', 'POST', 'PUT', 'DELETE'].forEach(method => {
    describe(`${method} /cfg`, () => {
      it('should return 405 @cfg', (done) => {
        request(app)[method.toLowerCase()]('/cfg')
          .set('accept', 'application/json')
          .expect(405, done);
      });
    });
  });
});

describe('Config override tests', function describe() {
  let testConfig = JSON.parse(JSON.stringify(config));

  it('should not allow override of object', function test() {
    let env = {
      CONFIG_services: 'not object'
    };
    override(testConfig, env);
    (typeof testConfig.services).should.be.equal('object');
  });
  it('should override existing configuration values', function test() {
    let env = {
      CONFIG_services_postgres_host: 'new host',
      CONFIG_services_postgres_password: 'new password'
    };
    override(testConfig, env);
    testConfig.services.postgres.host.should.be.equal('new host');
    testConfig.services.postgres.password.should.be.equal('new password');
  });
  it('should set non-existing configuration values from env', function test() {
    let env = {
      CONFIG_services_postgres_test: 'new value'
    };
    override(testConfig, env);
    testConfig.services.postgres.test.should.be.equal('new value');
  });
  it('should set non-existing configuration objects from env', function test() {
    let env = {
      CONFIG_new_object_value: 'new value'
    };
    override(testConfig, env);
    testConfig.new.object.value.should.be.equal('new value');
  });
});

