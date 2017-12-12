'use strict';

const _ = require('lodash');
const common = require('./common');
const utils = require('../../../src/utils');

module.exports = _.merge({}, common, {
    success: [
        (date) => [
            'Объявление',
            `Следующая игра: ${utils.formateDate(date)}`,
            '* Принять участие в игре: /add',
            '* Добавить другого из чата: /add @nickname',
            '* Добавить другого нe из чата: /add username',
            '* Отменить заявку на свое участие: /remove',
            '* Посмотреть информацию о предстоящей игре: /info'
        ].join('\n')
    ],
    eventAlreadyAddedError: [
        (date) => `Event already exists for: ${utils.formateDate(date)}`
    ]
});
