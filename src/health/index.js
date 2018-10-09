'use strict';

const { detailed, heartbeat } = require('@abot/atom-node-api-health').middleware;
const logger = require('../lib/logger');
const checks = require('./checks');
const pjson = require('../../package.json');

exports.routes = (app) => {
  /**
   * @api {get} /health Request health information
   * @apiGroup Health
   * @apiName Health
   *
   * @apiSuccess {String} status health status "Ok" or "Error" will be 500 on Error.
   * @apiSuccess {Object[]} components List of components.
   * @apiSuccess {String} components.name component name.
   * @apiSuccess {String} components.description component description.
   * @apiSuccess {String} components.status component status "Ok" or "Error".
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       status: "Ok",
   *       components: [
   *       {
   *         name: "Some Service"
   *         status: "Ok",
   *         result: {}
   *       }
   *     }
   *
   * @apiSampleRequest /health
   * @apiVersion 1.0.0
   */
  app.get('/health', (req, res, next) => {
    let mw = detailed(checks(), logger);
    mw(req, res, next);
  });

  /**
   * @api {get} /health/heartbeat Request health heartbeat
   * @apiGroup Health
   * @apiName Heartbeat
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     "OK Api vx.x.x @ new Date()"
   *
   * @apiSampleRequest /health/heartbeat
   * @apiVersion 1.0.0
   */
  app.get('/health/heartbeat', heartbeat(pjson));
};
