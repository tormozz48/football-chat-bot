'use strict';

const _ = require('lodash');
const common = require('./common');

module.exports = _.merge({}, common, {
    success: [
        (event) => {
            const {date, players} = event;

            return [
                `Дата игры: ${date}`,
                `Участники:`,
                `${players.map((player, index) => `${index + 1}: ${player.fullName()} \n`)}`,
                `Всего: ${event.getPlayersAmount()}`,
                `Осталось мест: ${event.getVacanciesAmount()}`
            ].join('\n');
        }
    ]
});
