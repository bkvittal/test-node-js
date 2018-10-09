'use strict';

let deepReplace = function deepReplace(obj, path, newValue) {
  /* eslint-disable no-param-reassign */
  var parts = path.split('.');
  let key = parts.pop();
  parts.forEach(inKey => {
    obj[inKey] = obj[inKey] || {};
    obj = obj[inKey];
  });

  let type = typeof obj[key];
  obj[key] = obj[key] || newValue;

  if (type === 'string') {
    obj[key] = newValue;
  } else if (type === 'number') {
    obj[key] = parseInt(newValue, 10);
  }
  return obj;
  /* eslint-enable no-param-reassign */
};

module.exports.override = function override(config, env) {
  // override services from environment variables
  let overrides = config;
  const prefix = 'CONFIG_';
  Object.keys(env).forEach(key => {
    if (key.startsWith(prefix)) {
      let path = key.substring(prefix.length).replace(/_/gi, '.');
      deepReplace(overrides, path, env[key]);
    }
  });
  return overrides;
};

