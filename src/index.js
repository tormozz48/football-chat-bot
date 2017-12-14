'use strict';

const path = require('path');
const config = require('config');
const Promise = require('bluebird');

const model = require('./model');
const bot = require('./bot');
const server = require('./server');

require('dotenv').config({path: path.join(process.cwd(), './config/config.env')});

const token = process.env.BOT_TOKEN || config.get('bot.token');

(() => {
    return Promise.resolve()
        .then(model.initialize)
        .then((schemas) => bot.create({token, model: schemas}))
        .then(server.start)
        .catch(() => {
            console.error('Critical error. Process will be terminated');
            process.exit(1);
        });
})();
