'use strict';

const answers = require('../../config/answers/commands/game-info');
const utils = require('../utils');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    return async (ctx) => {
        const {id} = ctx.message.chat;
        let answer;

        try {
            const event = await model.Event.findOne({active: true, chat_id: id});
            answer = replier.replySuccess()(event);
        } catch (error) {
            console.error('Error occurred on game info command');
            console.error(error.message);
            answer = replier.replyError()(error);
        } finally {
            ctx.reply(answer);
        }
    };
};
