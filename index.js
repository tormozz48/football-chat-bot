'use strict';

const config = require('config');
const model = require('./src/model');
const bot = require('./src/bot');

const token = process.env.BOT_TOKEN || config.get('bot.token');

model.initialize()
    .then((schemas) => {
        bot.create({
            token,
            model: schemas
        });
    });

