'use strict';

const config = require('config');
const errors = require('../errors/index');
const answers = require('../../config/answers/commands/event-remove');
const utils = require('../utils');

const debug = require('debug')('src:commands:event-remove');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    function handleError(error) {
        console.error('Error occured on event removing');
        console.error(error.message);

        if (error instanceof errors.EventAlreadyRemovedError) {
            return replier.reply(error.message)();
        } else {
            return replier.replyError()(error);
        }
    }

    return async (ctx) => {
        const {id} = ctx.message.chat;
        const date = config.get('eventDate')();

        debug(`chat id: ${id} date: ${date}`);

        let answer;

        try {
            const chat = await model.Chat.findOne({id});
            const event = await model.Event.findOne({chat_id: chat.id, active: true, date});

            if (!event) {
                debug('event does not exists');
                throw new errors.EventAlreadyRemovedError();
            }

            debug(`remove existed event: ${event.date} for chat: ${event.chat_id}`);
            await event.remove();

            answer = replier.replySuccess()(date);
        } catch (error) {
            answer = handleError(error);
        } finally {
            ctx.reply(answer);
        }
    };
};
