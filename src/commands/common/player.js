'use strict';

const utils = require('../../utils');

const debug = require('debug')('src:commands:common:player');

module.exports = ({model, replier, handleError, action}) => {
    return async (ctx) => {
        const {id} = ctx.message.chat;
        const {args} = ctx.state.command;

        debug(`chat id: ${id}}`);

        let answer = null;
        let player = null;

        try {
            const chat = await model.Chat.findOne({id});
            const event = await model.Event.findOne({chat_id: chat.id, active: true});

            debug(`event found: ${event.date} chat_id: ${event.chat_id}`);

            player = utils.findPlayer({
                name: args,
                availablePlayers: chat.members,
                defaultPlayer: ctx.from,
                createPlayer: (player) => new model.User(player)
            });

            debug(`player: id: ${player.id} firstName: ${player.first_name} lastName: ${player.last_name}`);

            event[action](player);
            await event.save();

            answer = replier.replaySuccess()(player.fullName());
        } catch (error) {
            answer = handleError(error, player);
        } finally {
            ctx.reply(answer);
        }
    };
};
