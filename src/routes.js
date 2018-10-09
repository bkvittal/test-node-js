'use strict';

const fs = require('fs-promise');
const health = require('./health/');
const cfg = require('./cfg/');
const config = require('./config');
const path = require('path');
const co = require('co');

module.exports = co.wrap(function* routes(app) {
  const controllerRootUrl = config.routes.controllerRootUrl;

  health.routes(app);
  cfg.routes(app);
  let controllersFolder = path.join(__dirname, 'controllers');
  // setup routes for all controllers
  (yield fs.readdir(controllersFolder)).forEach((file) => {
    /* eslint-disable global-require */
    let currentController = require(path.join(controllersFolder, file));
    currentController.routes(app, controllerRootUrl);
    /* eslint-enable global-require */
  });
});
