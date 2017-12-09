'use strict';

const config = require('config');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const EventSchema = require('./event');
const UserSchema = require('./user');

mongoose.Promise = Promise;
const debug = require('debug')('src:model:index');

exports.initialize = async () => {
    debug('Initialize database');

    let {user, password, host, port, database} = config.get('mongo');

    process.env.MONGO_USER && (user = process.env.MONGO_USER);
    process.env.MONGO_PASSWORD && (password = process.env.MONGO_PASSWORD);

    const connectionString = `mongodb://${user}:${password}@${host}:${port}/${database}`;
    const connectionOptions = {
        useMongoClient: true,
        autoIndex: true,
        reconnectTries: 3,
        reconnectInterval: 500,
        poolSize: 10,
        bufferMaxEntries: 0
    };

    debug(`Connect to database: ${connectionString}`);

    try {
        await mongoose.connect(connectionString, connectionOptions);
        debug('Connection to database has been established successfully');
    } catch(error) {
        console.error('Database connection error');
        console.error(error.message);
        throw error;
    }

    const User = mongoose.model('User', UserSchema);
    const Event = mongoose.model('Event', EventSchema);

    return {User, Event};
};
