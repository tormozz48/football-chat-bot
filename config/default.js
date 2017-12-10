'use strict';

const moment = require('moment');

module.exports = {
    port: 3000,
    bot: {
        token: ''
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
    }
};
