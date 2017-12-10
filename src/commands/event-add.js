'use strict';

const config = require('config');
const errors = require('../errors/index');
const answers = require('../../config/answers/commands/event-add');
const utils = require('../utils');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    function handleError(error) {
        console.error('Error occured on event creation');
        console.log(error.message);

        if (error instanceof errors.EventAlreadyAddedError) {
            return replier.reply(error.message)();
        } else {
            return replier.replyError()();
        }
    }

    return async (ctx) => {
        const {id} = ctx.message.chat;
        const date = config.get('eventDate')();

        let answer;

        try {
            const chat = await model.Chat.findOne({id});
            const event = await model.Event.findOne({chat_id: chat.id, active: true, date});

            if (event) {
                throw new errors.EventAlreadyAddedError();
            }

            await model.Event.updateMany({chat_id: chat.id, active: true}, {active: false});
            await model.Event.create({date, chat_id: chat.id});

            answer = replier.replaySuccess()(date);
        } catch (error) {
            answer = handleError(error);
        } finally {
            ctx.reply(answer);
        }
    };
};
