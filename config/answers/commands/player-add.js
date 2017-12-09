'use strict';

const _ = require('lodash');
const common = require('./common');

module.exports = _.merge({}, common, {
    success: [
        (fullName) => `${fullName} будет участвовать в игре.`,
        (fullName) => `${fullName} решил побегать.`,
        (fullName) => `${fullName} решил размять свои мощи.`
    ],
    playerAlreadyAddedError: [
        () => `Воу-воу палехче. Больше одного раза нельзя.`,
        (fullName) => `${fullName} ты что? Ты же уже добавился.`,
        (fullName) => `${fullName} aстанавись! Ты уже в игре.`
    ],
    playersLimitExceedError: [
        () => `Не, ну куда уже. И так 12 человек`,
        () => `А уже все. Нужно было раньше подсуетиться. 12 человек.`
    ]
});
