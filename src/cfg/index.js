'use strict';

const co = require('co');
const config = require('../config');
const fs = require('fs');
let buildFilePath = process.cwd() + '/build.json';
let skipConfigNames = ['util', 'keys'];
let configNameMap = {
  logging: { name: 'Logging', description: 'Logging settings' },
  server: { name: 'Server', description: 'Server settings' },
  appSettings: { name: 'AppSettings', description: 'Application settings' }
};

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// Get git build info from build.json file,
// which should be created as part of build process
function getGitInfo() {
  let missingBuildFile = {
    name: 'General',
    description: 'General',
    status: 'Error',
    result: {
      version: 'Could not read build info'
    }
  };

  return new Promise((resolve) => {
    if (fileExists(buildFilePath)) {
      // check that the build.json exists since require throws an error
      // if file doesn't exist
      try {
        let buildDetails = JSON.parse(fs.readFileSync(buildFilePath, 'utf8'));
        resolve(buildDetails);
      } catch (err) {
        resolve(missingBuildFile);
      }
    } else {
      resolve(missingBuildFile);
    }
  });
}

// Read configuration values
function getConfigImpl(cfg) {
  let result = [];
  Object.keys(cfg).forEach(key => {
    // hide secret details
    if (key === 'secret') {
      return;
    }

    let value = cfg[key];
    let valueType = typeof (value);

    if (skipConfigNames.indexOf(key) < 0) {
      let configMap = configNameMap[key];
      let item = {
        name: configMap ? configMap.name : key
      };

      if (valueType === 'object') {
        item.status = 'Ok';
        item.description = configMap ? configMap.description : '';
        item.components = getConfigImpl(cfg[key]);
        result.push(item);
      } else {
        item.value = value;
        result.push(item);
      }
    }
  });
  return result;
}

/**
  * @api {get} /cfg Request config information
  * @apiGroup Config
  * @apiName Config
  *
  * @apiSuccess {String} status overall cfg status "Ok" or "Error".
  * @apiSuccess {Object[]} components List of components.
  * @apiSuccess {String} components.name component name.
  * @apiSuccess {String} components.description component description.
  * @apiSuccess {String} components.status component status "Ok" or "Error"..
  * @apiSuccess {String} components.value component setting value.
  * @apiSuccess {Object[]} components.components sub components.
  *
  * @apiSuccessExample {json} Success-Response:
  *     HTTP/1.1 200 OK
  *     {
  *       status: "Ok",
  *       components: [
  *       {
  *         status: "Ok",
  *         result: {
  *           version: "no tag",
  *           informationalVersion: "branchName: feature/rework,
  *           SHA: 858f258, buildDate: Fri Oct 30 17:26:37 2015 -0400"
  *       }
  *     }
  *
  * @apiSampleRequest /cfg
  * @apiVersion 1.0.0
*/
let getCfg = co.wrap(function* getCfg(req, res) {
  let gitInfo = yield getGitInfo();
  let configComponents = [gitInfo];
  configComponents = configComponents.concat(getConfigImpl(config));
  let configSettings = {
    status: 'Ok',
    components: configComponents
  };
  return res.send(200, configSettings);
});

exports.routes = (app) => {
  app.get('/cfg', getCfg);
};
