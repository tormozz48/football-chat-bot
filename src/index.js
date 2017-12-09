'use strict';

const config = require('config');
const express = require('express');

const model = require('./model');
const bot = require('./bot');

const debug = require('debug')('src:index');

function startServer() {
    const port = process.env.PORT || config.get('port');

    express()
        .get('/', (req, res) => {
            res.status(200.).json({status: 'ok'});
        })
        .listen(port, () => {
            debug(`app listening on port ${port}`);
        });
}

model.initialize()
    .then((schemas) => {
        const token = process.env.BOT_TOKEN || config.get('bot.token');
        const botan = bot.create({token, model: schemas});

        startServer();
    })
    .catch(() => {
        console.error('Critical error. Process will be terminated');
        process.exit(1);
    });

