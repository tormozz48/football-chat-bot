'use strict';

const moment = require('moment');

module.exports = {
    port: 3000,
    bot: {
        token: '',
        witToken: ''
    },
    cron: {
        serverPing: '* * * * *',
        quote: '0 12 * * *'
    },
    mongo: {
        user: '',
        password: '',
        host: '127.0.0.1',
        port: '27017',
        database: 'football'
    },
    eventDate: () => {
        const currentDate = moment.utc();

        return currentDate
            .weekday(currentDate.weekday() > 0 ? 7 : 0)
            .hour(17)
            .minute(30)
            .second(0)
            .millisecond(0)
            .toDate();
    },
    weather: {
        city: 'simferopol'
    },
    wit: {
        enabled: false
    },
    proxy: {
        host: '127.0.0.1',
        port: 1080,
        login: '',
        password: ''
    }
};
