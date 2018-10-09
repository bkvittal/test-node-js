'use strict';

const rp = require('request-promise');
const NodeCache = require('node-cache');
const config = require('../config');
let myCache = new NodeCache({ stdTTL: config.cacheTTL || 600 });

let cacheKey = function cacheKey() {
  return [].slice.apply(arguments).join('');
};

exports.cachedRequest = function cachedRequest(uri, method, ttl) {
  let options = {
    method: method,
    uri: uri,
    headers: {
      Accept: 'application/json'
    }
  };
  let key = cacheKey(uri, method);
  let cached = myCache.get(key);
  if (!cached) {
    return rp(options).then(response => {
      cached = JSON.parse(response);
      myCache.set(key, cached, ttl);
      return cached;
    });
  }
  return new Promise((resolve) => { resolve(cached); });
};

exports.cache = myCache;
