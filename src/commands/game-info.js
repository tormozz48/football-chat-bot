'use strict';

const answers = require('../../config/answers/commands/game-info');
const utils = require('../utils');

const debug = require('debug')('src:commands:game-info');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    return async (ctx) => {
        const {first_name, last_name} = ctx.from;

        debug(`received command /info from ${first_name} ${last_name}`);
        const player = new model.User(ctx.from);

        try {
            const event = await model.Event.findOne({active: true});
            ctx.reply(replier.replaySuccess()(event));
        } catch (error) {
            ctx.reply(replier.replyError()(player.fullName()));
        }
    };
};
