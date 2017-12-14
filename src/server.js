'use strict';

const config = require('config');
const express = require('express');
const http = require('http');

const debug = require('debug')('src:server');

exports.start = () => {
    const port = process.env.PORT || config.get('port');

    const app = express()
        .get('/ping', (req, res) => {
            debug(`Received ping. Date: ${new Date()}`);
            res.status(200.).json({status: 'ok'});
        });

    const server = http.createServer(app);
    server.listen(port, () => {
        console.info(`app listening on port ${port}`);
    });

    return server;
};
