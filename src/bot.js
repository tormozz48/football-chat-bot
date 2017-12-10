'use strict';

const Telegraf = require('telegraf');
const TelegrafLogger = require('telegraf-logger');
const commandParts = require('telegraf-command-parts');
const commands = require('./commands');

const debug = require('debug')('src:bot');

exports.create = ({token, model}) => {
    const bot = new Telegraf(token);

    const logger = new TelegrafLogger({
        format: '%updateType => @%username %firstName %lastName (%fromId): <%updateSubType> %content'
    });

    bot.use(logger.middleware());
    bot.use(commandParts());

    bot.start(commands.start(model, bot));

    bot.command('help', commands.help(model)); // /help
    bot.command('add', commands.playerAdd(model)); // /add - add player to game
    bot.command('remove', commands.playerRemove(model)); // /remove - remove player from game
    bot.command('info', commands.gameInfo(model)); // /info - get game info
    bot.command('add_event', commands.eventAdd(model)); // /add_event - add new event
    bot.command('remove_event', commands.eventRemove(model)); // /remove_event - remove active event

    bot.startPolling();

    return bot;
};
