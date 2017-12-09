'use strict';

const _ = require('lodash');
const common = require('./common');

module.exports = _.merge({}, common, {
    success: [
        (fullName) => `${fullName} решил всех кинуть.`,
        (fullName) => `${fullName} решил скипнуть.`,
        (fullName) => `${fullName} нашел более важные дела чем футбол.`
    ],
    playerAlreadyRemovedError: [
        () => `Так ты ж уже удалился`,
        (fullName) => `${fullName} все. Мы тебя в расчет не берем.`,
        (fullName) => `${fullName} прекрати. Что ты делаешь?`
    ]
});
