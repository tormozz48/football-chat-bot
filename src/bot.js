'use strict';

const Telegraf = require('telegraf');
const TelegrafLogger = require('telegraf-logger');
const commandParts = require('telegraf-command-parts');
const commands = require('./commands');

/**
 * Bot initializer
 * @param {Object} options
 * @param {String} options.token - bot token string
 * @param {Object} options.model
 */
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
    bot.command('event_add', commands.eventAdd(model)); // /event_add - add new event
    bot.command('event_remove', commands.eventRemove(model)); // /event_remove - remove active event
    bot.command('weather_forecast', commands.weatherForecast()); // /weater_forecast

    bot.startPolling();

    return bot;
};
