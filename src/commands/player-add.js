'use strict';

const _ = require('lodash');
const generate = require('nanoid/generate');
const errors = require('../errors/index');
const answers = require('../../config/answers/commands/player-add');
const utils = require('../utils');

const debug = require('debug')('src:commands:player-add');

module.exports = (model) => {
    const replier = utils.createReplier(answers);

    function handleError(error, player) {
        console.error('Error occurred on adding player');
        console.error(error.message);

        if (error instanceof errors.PlayerAlreadyAddedError ||
            error instanceof errors.PlayersLimitExceedError) {
            return replier.reply(error.message)(player.fullName());
        } else {
            return replier.replyError()(player.fullName());
        }
    }

    function findPlayer({playerName, chatMembers, defaultPlayer}) {
        if (!playerName) {
            return defaultPlayer;
        }

        const player = _.find(chatMembers, (member) => {
            return `@${member.username}` === playerName || `@${member.fullName()}` === playerName;
        });

        return player || new model.User({
            id: (-1) * generate('1234567890', 10),
            first_name: playerName,
            username: playerName
        });
    }

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

            player = findPlayer({
                playerName: args,
                chatMembers: chat.members,
                defaultPlayer: new model.User(ctx.from)
            });

            debug(`player: id: ${player.id} firstName: ${player.first_name} lastName: ${player.last_name}`);

            event.addPlayer(player);
            await event.save();

            answer = replier.replaySuccess()(player.fullName());
        } catch (error) {
            answer = handleError(error, player);
        } finally {
            ctx.reply(answer);
        }
    };
};
