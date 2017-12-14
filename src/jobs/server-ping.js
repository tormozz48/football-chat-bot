'use strict';

const config = require('config');
const cron = require('node-cron');
const got = require('got');

const debug = require('debug')('src:jobs:server-ping');

const cronExpression = config.get('cron.serverPing');

module.exports = () => {
    const port = process.env.PORT || config.get('port');

    return cron.schedule(cronExpression, async function() {
        try {
            debug('ping server with request /ping');
            await got.get(`http://localhost:${port}/ping`);
        } catch (error) {
            console.error('Server does not responding for /ping request');
        }
    }, false);
};

