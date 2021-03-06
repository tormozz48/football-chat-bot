'use strict';

require('babel-core/register');
require('babel-polyfill');

const path = require('path');
const config = require('config');

const model = require('./model');
const bot = require('./bot');
const server = require('./server');
//const jobs = require('./jobs');

require('dotenv').config({path: path.join(process.cwd(), './config/config.env')});

const token = process.env.BOT_TOKEN || config.get('bot.token');

(async () => {
    try {
        const dbModel = await model.initialize();

        // const _bot = bot.create({token, model: dbModel});
        bot.create({token, model: dbModel});

        server.start();

        // jobs.serverPingJob(dbModel).start();
        // jobs.quoteJob(dbModel, _bot).start();
    } catch (error) {
        console.error('Critical error. Process will be terminated');
        process.exit(1);
    }
})();
