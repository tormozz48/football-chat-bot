'use strict';

const answers = require('../../config/answers/commands/help');
const utils = require('../utils');

module.exports = () => {
    const replier = utils.createReplier(answers);

    return async (ctx) => {
        ctx.reply(replier.replySuccess()());
    };
};
