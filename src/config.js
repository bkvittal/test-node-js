'use strict';

const path = require('path');
const config = require('everyconfig')(path.join(__dirname, '..', 'config'));
const { override } = require('./lib/objectHelpers');

// override services from environment variables
override(config, process.env);

module.exports = config;
