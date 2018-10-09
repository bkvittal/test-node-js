'use strict';

const logger = require('../lib/logger')();
const { httpHelper } = require('@abot/atom-node-api-health');
const httpStatus = httpHelper(logger);

module.exports = () => {
  // TODO: replace with your own services
  let checks = [
    () => httpStatus('https://google.com'),
    () => httpStatus('https://yahoo.com')
  ];
  return checks;
};
