'use strict';

const restify = require('restify');
const argv = require('yargs').argv;

const atomNodeRestify = require('@abot/atom-node-restify');
const config = require('./config');
const logger = require('./lib/logger')();

let port = argv.port || process.env.PORT || config.port || 3000;
let environment = process.env.NODE_ENV || 'dev';

let pjson = require('../package.json');
let app = restify.createServer({
  name: pjson.name,
  version: pjson.version,
  log: logger
});

app.acceptable = config.accept;
app.use(restify.acceptParser(app.acceptable));
app.use(restify.authorizationParser());
app.use(restify.queryParser());
app.use(restify.bodyParser());
app.use(restify.requestLogger());
app.use(atomNodeRestify.createEnsureAfterEvents(app));
app.use(atomNodeRestify.createErrorHandler(app, logger, config));

// Bootstrap routes
require('./routes')(app);

app.on('after', restify.auditLogger({
  log: logger
}));

// Start listening
app.listen(port, () => {
  logger.info('Atom ' + environment + ' started listening on ' + port);
});

// Log exception and exit the process if an unhandled exception occurs.
// Don't exit on error if in env=test
if (process.env.NODE_ENV !== 'test') {
  process.on('uncaughtException', (err) => {
    /* eslint-disable no-console */
    console.error('Unhandled exception. Exiting process.' + err);
    /* eslint-enable no-console */
    logger.fatal('Unhandled exception. Exiting process.' + err);
    process.exit(1);
  });
}
// Expose
module.exports = app;
