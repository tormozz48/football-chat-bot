'use strict';

const config = require('config');
const errors = require('../errors/index');
const answers = require('../../config/answers/commands/event-add');
const utils = require('../utils');

const debug = require('debug')('src:commands:event-add');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    function handleError(error) {
        console.error('Error occured on event creation');
        console.error(error.message);

        if (error instanceof errors.EventAlreadyAddedError) {
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

            if (event) {
                debug('event already exist');
                throw new errors.EventAlreadyAddedError();
            }

            debug('make inactive all existed events');
            await model.Event.updateMany({chat_id: chat.id, active: true}, {active: false});

            debug(`create new event with date: ${date} for chat: ${chat.id}`);
            await model.Event.create({date, chat_id: chat.id});

            answer = replier.replySuccess()(date);
        } catch (error) {
            answer = handleError(error);
        } finally {
            ctx.reply(answer);
        }
    };
};
