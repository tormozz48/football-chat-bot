'use strict';

const _ = require('lodash');
const utils = require('../../../src/utils');
const common = require('./common');

module.exports = _.merge({}, common, {
    success: [
        (event) => {
            const {date, players} = event;

            return [
                `Дата игры: ${utils.formateDate(date)}`,
                `Участники:`,
                `${players.map((player, index) => `${index + 1}: ${player.fullName()}`).join('\n')}`,
                `Всего: ${event.getPlayersAmount()}`,
                `Осталось мест: ${event.getVacanciesAmount()}`
            ].join('\n');
        }
    ]
});
