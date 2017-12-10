'use strict';

const _ = require('lodash');
const common = require('./common');
const utils = require('../../../src/utils');

module.exports = _.merge({}, common, {
    success: [
        (date) => [
            'Объявление',
            `Новая дата игры: ${utils.formateDate(date, 'DD-MM-YYYY HH:mm:ss')}`,
            'Принять участие в игре: /add',
            'Добавить другого из чата: /add @nickname, например: /add @a-lexx',
            'Добавить другого нe из чата: /add username, например: /add Дима',
            'Отменить заявку на свое участие: /remove'
        ].join('\n')
    ],
    eventAlreadyAddedError: [
        () => 'Да уже создали событие. Ты все проспал.',
        () => 'Смотри выше. Ты не первый такой.',
        () => 'Ишь ты какой резкий. Иди отдыхай. Все уже сделали.'
    ]
});
