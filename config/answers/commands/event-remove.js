'use strict';

const _ = require('lodash');
const common = require('./common');
const utils = require('../../../src/utils');

module.exports = _.merge({}, common, {
    success: [
        (date) => `Событие на ${utils.formateDate(date, 'DD-MM-YYYY HH:mm:ss')} было удалено`
    ],
    eventAlreadyRemovedError: [
        () => 'Событие уже было удалено или не было создано.'
    ]
});
