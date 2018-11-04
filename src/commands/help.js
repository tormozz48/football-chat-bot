'use strict';

const answers = require('../../config/answers/commands/help');
const utils = require('../utils');

const debug = require('debug')('src:commands:help');

module.exports = () => {
    const replier = utils.createReplier(answers);

    return async (ctx) => {
        debug(`received command "/help"`);
        ctx.reply(replier.replySuccess()());
    };
};
