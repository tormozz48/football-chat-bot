'use strict';

const answers = require('../../config/answers/commands/game-info');
const utils = require('../utils');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    return async (ctx) => {
        const {id} = ctx.message.chat;
        const player = new model.User(ctx.from);

        try {
            const event = await model.Event.findOne({active: true, chat_id: id});
            ctx.reply(replier.replaySuccess()(event));
        } catch (error) {
            ctx.reply(replier.replyError()(player.fullName()));
        }
    };
};
