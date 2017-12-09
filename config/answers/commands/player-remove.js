'use strict';

module.exports = {
    success: [
        (fullName) => `${fullName} решил всех кинуть.`,
        (fullName) => `${fullName} решил скипнуть.`,
        (fullName) => `${fullName} нашел более важные дела чем футбол.`
    ],
    playerAlreadyRemovedError: [
        () => `Так ты ж уже удалился`,
        (fullName) => `${fullName} все. Мы тебя в расчет не берем.`,
        (fullName) => `${fullName} прекрати. Что ты делаешь?`
    ],
    error: [
        () => `Не судьба! Но ты можешь попробовать еще разок.`,
        () => `Случилось страшное. Но ты можешь поплакать в углу и написать нам.`
    ]
};
