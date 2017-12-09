'use strict';

const errors = require('../errors/index');
const answers = require('../../config/answers/commands/player-remove');
const utils = require('../utils');

const debug = require('debug')('src:commands:player-remove');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    return async (ctx) => {
        const {first_name, last_name} = ctx.from;

        debug(`received command /remove from ${first_name} ${last_name}`);

        const player = new model.User(ctx.from);
        let answer = null;

        try {
            const event = await model.Event.findOne({active: true});
            event.removePlayer(player);
            await event.save();

            answer = replier.replaySuccess()(player.fullName());
        } catch (error) {
            console.error('Error occurred on removing player');
            console.error(error.message);

            if (error instanceof errors.PlayerAlreadyRemovedError) {
                answer = replier.reply(error.message)(player.fullName());
            } else {
                answer = replier.replyError()(player.fullName());
            }
        } finally {
            ctx.reply(answer);
        }
    };
};
